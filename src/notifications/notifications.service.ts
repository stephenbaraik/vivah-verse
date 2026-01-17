import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: Transporter;

  constructor(
    @Optional()
    @InjectQueue('notifications')
    private readonly notificationsQueue?: Queue,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmailNow(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Vivah Verse" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error as Error);
      // Don't throw - notifications should not block core logic
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (this.notificationsQueue) {
      try {
        await this.notificationsQueue.add(
          'email',
          { to, subject, html },
          {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5_000 },
            removeOnComplete: true,
            removeOnFail: false,
          },
        );
        this.logger.log(`Email queued to ${to}: ${subject}`);
      } catch (error) {
        this.logger.error(
          'Failed to queue email; falling back to direct send',
          error as Error,
        );
        await this.sendEmailNow(to, subject, html);
      }
      return;
    }

    await this.sendEmailNow(to, subject, html);
  }

  async paymentConfirmed(email: string, amount: number, weddingId: string) {
    return this.sendEmail(
      email,
      '💳 Payment Confirmed - Vivah Verse',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4caf50;">Payment Confirmed!</h2>
          <p>Dear Customer,</p>
          <p>Your payment has been successfully processed.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₹${amount}</p>
            <p><strong>Wedding ID:</strong> ${weddingId}</p>
          </div>
          <p>Thank you for your payment!</p>
          <p style="color: #666;">— The Vivah Verse Team</p>
        </div>
      `,
    );
  }

  async bookingCancelled(email: string, refundAmount: number) {
    return this.sendEmail(
      email,
      'Booking Cancelled - Vivah Verse',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff5722;">Booking Cancelled</h2>
          <p>Dear Customer,</p>
          <p>Your booking has been cancelled as requested.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Refund Amount:</strong> ₹${refundAmount.toLocaleString('en-IN')}</p>
            <p style="font-size: 12px; color: #666;">Refund will be processed within 5-7 business days.</p>
          </div>
          <p>We hope to serve you again in the future.</p>
          <p style="color: #666;">— The Vivah Verse Team</p>
        </div>
      `,
    );
  }

  // WhatsApp stub (plug Twilio/Meta/Gupshup later)
  async sendWhatsApp(phone: string, message: string) {
    await Promise.resolve();
    this.logger.log(`WhatsApp → ${phone}: ${message}`);
    // TODO: Integrate with Twilio / Meta WhatsApp Cloud API / Gupshup
  }

  async bookingConfirmedWhatsApp(phone: string, venue: string, date: Date) {
    return this.sendWhatsApp(
      phone,
      `🎉 Booking Confirmed!\n\nVenue: ${venue}\nDate: ${date.toDateString()}\n\nThank you for choosing Vivah Verse!`,
    );
  }

  async bookingCancelledWhatsApp(phone: string, refundAmount: number) {
    return this.sendWhatsApp(
      phone,
      `Your booking has been cancelled.\n\nRefund: ₹${refundAmount.toLocaleString('en-IN')}\n\nRefund will be processed in 5-7 days.`,
    );
  }
}
