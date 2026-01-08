import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async blockDates(userId: string, venueId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new BadRequestException('Start date must be before end date');
    }

    // 1️⃣ Verify venue belongs to vendor
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
      include: { vendor: true },
    });

    if (!venue || venue.vendor.userId !== userId) {
      throw new ForbiddenException('Not authorized for this venue');
    }

    // 2️⃣ Check for overlapping blocks
    const conflict = await this.prisma.venueAvailability.findFirst({
      where: {
        venueId,
        AND: [
          { startDate: { lte: end } },
          { endDate: { gte: start } },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Venue already blocked for this date range');
    }

    // 3️⃣ Block dates
    return this.prisma.venueAvailability.create({
      data: {
        venueId,
        startDate: start,
        endDate: end,
      },
    });
  }

  async getVenueAvailability(venueId: string) {
    return this.prisma.venueAvailability.findMany({
      where: { venueId },
      orderBy: { startDate: 'asc' },
    });
  }
}
