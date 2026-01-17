import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InvoicesService } from '../invoices/invoices.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentStatus, BookingStatus } from '@prisma/client';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay | null = null;
  private isTestMode = false;

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private invoices: InvoicesService,
  ) {
    // Check if Razorpay credentials are configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (
      keyId &&
      keySecret &&
      !keyId.includes('xxx') &&
      !keySecret.includes('xxx')
    ) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      console.log('💳 Razorpay initialized in LIVE mode');
    } else {
      this.isTestMode = true;
      console.log('🧪 Payments running in TEST mode (no Razorpay)');
    }
  }

  async initiateWeddingPayment(userId: string, dto: InitiatePaymentDto) {
    const { weddingId, amount, payeeId } = dto;

    // 1️⃣ Verify wedding exists and user can make payment
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
      include: { user: true },
    });

    if (!wedding) {
      throw new BadRequestException('Wedding not found');
    }

    // Allow clients to pay for their own weddings, or internal users
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === 'CLIENT' && wedding.userId !== userId) {
      throw new ForbiddenException('You can only pay for your own weddings');
    }

    const amountPaise = amount * 100; // Convert to paise

    // TEST MODE: Skip Razorpay API call
    if (this.isTestMode) {
      const testOrderId = `test_order_${crypto.randomBytes(8).toString('hex')}`;

      const payment = await this.prisma.payment.create({
        data: {
          weddingId,
          amount,
          paidBy: userId,
          paidTo: payeeId,
          provider: 'TEST',
          providerRef: testOrderId,
        },
      });

      console.log({
        event: 'WEDDING_PAYMENT_INITIATED_TEST_MODE',
        weddingId,
        paymentId: payment.id,
      });

      return {
        orderId: testOrderId,
        razorpayKey: 'test_mode',
        amount: amountPaise,
        currency: 'INR',
        paymentId: payment.id,
        testMode: true,
        message: 'Test mode - use /payments/confirm to complete payment',
      };
    }

    // 2️⃣ Create Razorpay order (LIVE MODE)
    const order = await this.razorpay!.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: weddingId,
    });

    // 3️⃣ Save payment record
    const payment = await this.prisma.payment.create({
      data: {
        weddingId,
        amount,
        paidBy: userId,
        paidTo: payeeId,
        provider: 'RAZORPAY',
        providerRef: order.id,
      },
    });

    console.log({
      event: 'WEDDING_PAYMENT_INITIATED_LIVE_MODE',
      weddingId,
      paymentId: payment.id,
      orderId: order.id,
    });

    return {
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: amountPaise,
      currency: 'INR',
      paymentId: payment.id,
    };
  }

  // Legacy confirm (for testing without Razorpay)
  async confirmPayment(userId: string, paymentId: string, providerRef: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const existingPayment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: {
          wedding: { include: { user: true } },
          payer: true,
          payee: true,
        },
      });

      if (
        !existingPayment ||
        existingPayment.payer.id !== userId
      ) {
        throw new ForbiddenException('Invalid payment');
      }

      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.SUCCESS,
          providerRef,
        },
        include: {
          wedding: { include: { user: true } },
          payer: true,
          payee: true,
        },
      });

      console.log({
        event: 'PAYMENT_CONFIRMED',
        weddingId: payment.weddingId,
        paymentId,
      });

      return {
        payment,
        email: payment.wedding.user.email,
        amount: payment.amount,
        weddingId: payment.weddingId,
      };
    });

    // Send notification outside transaction
    await this.notifications.paymentConfirmed(
      result.email,
      result.amount,
      result.weddingId,
    );

    return result.payment;
  }

  // Razorpay webhook confirmation (PRODUCTION)
  async confirmRazorpayPayment(orderId: string, paymentRef: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerRef: orderId },
        include: {
          wedding: { include: { user: true } },
          payer: true,
          payee: true,
        },
      });

      if (!payment) return { success: false, message: 'Payment not found' };

      // Prevent duplicate webhook processing
      if (payment.status === PaymentStatus.SUCCESS) {
        console.log({
          event: 'DUPLICATE_WEBHOOK_IGNORED',
          orderId,
          paymentRef,
        });
        return { success: true, message: 'Already processed' };
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCESS,
          providerRef: paymentRef,
        },
      });

      console.log({
        event: 'PAYMENT_CONFIRMED',
        weddingId: payment.weddingId,
        paymentRef,
      });

      return {
        success: true,
        weddingId: payment.weddingId,
        email: payment.wedding.user.email,
        amount: payment.amount,
      };
    });

    // Send notification outside transaction (non-blocking)
    if (result.success && result.email) {
      await this.notifications.paymentConfirmed(
        result.email,
        result.amount,
        result.weddingId,
      );

      // Generate invoice
      try {
        const invoice = await this.invoices.generateInvoice(
          'system',
          'ADMIN',
          result.weddingId,
        );
        console.log(`Invoice generated: ${invoice.invoiceNo}`);
      } catch (err) {
        console.error('Invoice generation failed:', err);
      }
    }

    return { success: result.success };
  }
}
