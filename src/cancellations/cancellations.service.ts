import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, RefundStatus } from '@prisma/client';

@Injectable()
export class CancellationsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async cancelBooking(userId: string, bookingId: string, reason?: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1️⃣ Fetch booking with user for notification
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          wedding: { include: { user: true } },
          payment: true,
        },
      });

      if (!booking || booking.wedding.userId !== userId) {
        throw new ForbiddenException('Invalid booking');
      }

      if (booking.status !== BookingStatus.CONFIRMED) {
        throw new BadRequestException('Booking cannot be cancelled');
      }

      if (!booking.payment) {
        throw new BadRequestException('No payment found for this booking');
      }

      const payment = booking.payment;

      // 2️⃣ Calculate refund
      const daysBefore =
        (booking.weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

      let refundAmount = 0;

      if (daysBefore >= 30) refundAmount = payment.amount;
      else if (daysBefore >= 7) refundAmount = payment.amount * 0.5;

      // 3️⃣ Update booking
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      // 4️⃣ Restore availability (delete any blocks covering this date)
      await tx.venueAvailability.deleteMany({
        where: {
          venueId: booking.venueId,
          startDate: { lte: booking.weddingDate },
          endDate: { gte: booking.weddingDate },
        },
      });

      // 5️⃣ Create refund record (if applicable)
      let refundRecord: { id: string; status: RefundStatus } | null = null;
      if (refundAmount > 0) {
        refundRecord = await tx.refund.create({
          data: {
            paymentId: payment.id,
            amount: Math.floor(refundAmount),
            reason,
          },
        });
      }

      return {
        bookingId,
        refundAmount: Math.floor(refundAmount),
        refundStatus: refundRecord ? RefundStatus.INITIATED : null,
        email: booking.wedding.user.email,
      };
    });

    // Send notification outside transaction (non-blocking)
    if (result.email) {
      await this.notifications.bookingCancelled(
        result.email,
        result.refundAmount,
      );
    }

    return {
      bookingId: result.bookingId,
      refundAmount: result.refundAmount,
      refundStatus: result.refundStatus,
    };
  }
}
