import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async bookVenue(userId: string, weddingId: string, venueId: string) {
    // 1️⃣ Verify wedding ownership
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!wedding || wedding.userId !== userId) {
      throw new ForbiddenException('Invalid wedding');
    }

    const date = wedding.weddingDate;

    // 2️⃣ Transaction: availability check + booking
    return this.prisma.$transaction(async (tx) => {
      // Check availability
      const blocked = await tx.venueAvailability.findFirst({
        where: {
          venueId,
          AND: [
            { startDate: { lte: date } },
            { endDate: { gte: date } },
          ],
        },
      });

      if (blocked) {
        throw new BadRequestException('Venue not available on this date');
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          weddingId,
          venueId,
          weddingDate: date,
        },
      });

      // Block venue for that date
      await tx.venueAvailability.create({
        data: {
          venueId,
          startDate: date,
          endDate: date,
        },
      });

      return booking;
    });
  }
}
