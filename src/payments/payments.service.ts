import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InvoicesService } from '../invoices/invoices.service';
import { PaymentStatus, BookingStatus } from '@prisma/client';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private invoices: InvoicesService,
  ) {}

  async initiatePayment(userId: string, bookingId: string) {
    // 1️⃣ Verify booking ownership
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { wedding: true, venue: true },
    });

    if (!booking || booking.wedding.userId !== userId) {
      throw new ForbiddenException('Invalid booking');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking is not payable');
    }

    const amount = booking.venue.basePrice * 100; // paise

    // 2️⃣ Create Razorpay order
    const order = await this.razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: bookingId,
    });

    // 3️⃣ Save payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.venue.basePrice,
        provider: 'RAZORPAY',
        providerRef: order.id,
      },
    });

    // 4️⃣ Return data for frontend checkout
    return {
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
      paymentId: payment.id,
    };
  }

  // Legacy confirm (for testing without Razorpay)
  async confirmPayment(paymentId: string, providerRef: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.SUCCESS,
          providerRef,
        },
        include: { booking: true },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
        },
      });

      return payment;
    });
  }

  // Razorpay webhook confirmation (PRODUCTION)
  async confirmRazorpayPayment(orderId: string, paymentRef: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerRef: orderId },
        include: {
          booking: {
            include: {
              venue: true,
              wedding: { include: { user: true } },
            },
          },
        },
      });

      if (!payment) return { success: false, message: 'Payment not found' };

      // Prevent duplicate webhook processing
      if (payment.status === PaymentStatus.SUCCESS) {
        console.log({ event: 'DUPLICATE_WEBHOOK_IGNORED', orderId, paymentRef });
        return { success: true, message: 'Already processed' };
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCESS,
          providerRef: paymentRef,
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });

      console.log({ event: 'PAYMENT_CONFIRMED', bookingId: payment.bookingId, paymentRef });

      return {
        success: true,
        bookingId: payment.bookingId,
        email: payment.booking.wedding.user.email,
        venue: payment.booking.venue.name,
        date: payment.booking.weddingDate,
      };
    });

    // Send notification and generate invoice outside transaction (non-blocking)
    if (result.success && result.email) {
      this.notifications.bookingConfirmed(result.email, result.venue!, result.date!);
      
      // Generate invoice
      try {
        const invoice = await this.invoices.generateInvoice(result.bookingId!);
        console.log(`Invoice generated: ${invoice.invoiceNo}`);
      } catch (err) {
        console.error('Invoice generation failed:', err);
      }
    }

    return { success: result.success };
  }
}
