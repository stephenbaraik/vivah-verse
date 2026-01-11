import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all bookings for user's weddings
   */
  async getMyBookings(userId: string) {
    // Get user's weddings first
    const weddings = await this.prisma.wedding.findMany({
      where: { userId },
      select: { id: true },
    });

    const weddingIds = weddings.map((w) => w.id);

    return this.prisma.booking.findMany({
      where: { weddingId: { in: weddingIds } },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            address: true,
            capacity: true,
            basePrice: true,
            pricePerPlate: true,
            images: true,
          },
        },
        wedding: {
          select: {
            id: true,
            weddingDate: true,
            city: true,
            guestCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get booking by ID (only if user owns it)
   */
  async getBookingById(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: true,
        wedding: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify ownership through wedding
    if (booking.wedding.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

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
          AND: [{ startDate: { lte: date } }, { endDate: { gte: date } }],
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
