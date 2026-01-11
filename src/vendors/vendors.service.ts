import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async createVendor(userId: string, businessName: string) {
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new BadRequestException('Vendor profile already exists');
    }

    return this.prisma.vendor.create({
      data: {
        userId,
        businessName,
        status: 'PENDING',
      },
    });
  }

  async getMyVendorProfile(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        venues: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendor;
  }

  async updateVendorProfile(userId: string, data: { businessName?: string }) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return this.prisma.vendor.update({
      where: { userId },
      data,
    });
  }

  async getDashboard(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        venues: {
          include: {
            bookings: {
              where: {
                weddingDate: { gte: new Date() },
              },
              include: {
                wedding: {
                  include: {
                    user: {
                      select: { name: true, email: true },
                    },
                  },
                },
                payment: true,
              },
              orderBy: { weddingDate: 'asc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    // Calculate stats
    const allBookings = vendor.venues.flatMap((v) => v.bookings);
    const confirmedBookings = allBookings.filter(
      (b) => b.status === 'CONFIRMED',
    );
    const pendingBookings = allBookings.filter((b) => b.status === 'PENDING');

    // Calculate earnings
    const totalEarnings = confirmedBookings.reduce((sum, b) => {
      return sum + (b.payment?.amount || 0);
    }, 0);

    // Get upcoming bookings
    const upcomingBookings = allBookings
      .filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING')
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        weddingDate: b.weddingDate,
        status: b.status,
        clientName: b.wedding?.user?.name || 'Unknown',
        clientEmail: b.wedding?.user?.email,
        guestCount: b.wedding?.guestCount || 0,
      }));

    return {
      stats: {
        totalVenues: vendor.venues.length,
        activeBookings: confirmedBookings.length,
        pendingBookings: pendingBookings.length,
        totalEarnings,
        rating: 4.5, // Placeholder - would come from reviews
        reviewCount: 0,
      },
      upcomingBookings,
      vendorStatus: vendor.status,
    };
  }

  async getStats(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        venues: {
          include: {
            bookings: {
              include: { payment: true },
            },
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const allBookings = vendor.venues.flatMap((v) => v.bookings);
    const confirmedBookings = allBookings.filter(
      (b) => b.status === 'CONFIRMED',
    );
    const totalEarnings = confirmedBookings.reduce(
      (sum, b) => sum + (b.payment?.amount || 0),
      0,
    );

    return {
      totalVenues: vendor.venues.length,
      totalBookings: allBookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: allBookings.filter((b) => b.status === 'PENDING').length,
      cancelledBookings: allBookings.filter((b) => b.status === 'CANCELLED')
        .length,
      totalEarnings,
      thisMonthEarnings: 0, // TODO: Calculate based on date range
    };
  }

  async getBookings(
    userId: string,
    params?: { status?: string; page?: number; limit?: number },
  ) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const venueIds = await this.prisma.venue.findMany({
      where: { vendorId: vendor.id },
      select: { id: true },
    });

    const where: Prisma.BookingWhereInput = {
      venueId: { in: venueIds.map((v) => v.id) },
    };

    if (params?.status) {
      where.status = params.status as BookingStatus;
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          venue: { select: { id: true, name: true, city: true } },
          wedding: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
            },
          },
          payment: true,
        },
        orderBy: { weddingDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      bookings: bookings.map((b) => ({
        id: b.id,
        weddingDate: b.weddingDate,
        status: b.status,
        venue: b.venue,
        client: {
          name: b.wedding?.user?.name || 'Unknown',
          email: b.wedding?.user?.email,
          phone: b.wedding?.user?.phone,
        },
        guestCount: b.wedding?.guestCount || 0,
        amount: b.payment?.amount || 0,
        paymentStatus: b.payment?.status,
        createdAt: b.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCalendar(userId: string, month: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    // Parse month (format: YYYY-MM)
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of month

    const venueIds = await this.prisma.venue.findMany({
      where: { vendorId: vendor.id },
      select: { id: true },
    });

    // Get bookings for the month
    const bookings = await this.prisma.booking.findMany({
      where: {
        venueId: { in: venueIds.map((v) => v.id) },
        weddingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        venue: { select: { name: true } },
        wedding: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Get blocked dates
    const blockedDates = await this.prisma.venueAvailability.findMany({
      where: {
        venueId: { in: venueIds.map((v) => v.id) },
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    // Build calendar days
    const days: Array<{
      date: string;
      bookings: Array<{
        id: string;
        venueName: string;
        clientName: string;
        status: BookingStatus;
      }>;
      isBlocked: boolean;
      hasBooking: boolean;
    }> = [];
    const daysInMonth = endDate.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day);
      const dateStr = date.toISOString().split('T')[0];

      const dayBookings = bookings.filter((b) => {
        const bookingDate = new Date(b.weddingDate).toISOString().split('T')[0];
        return bookingDate === dateStr;
      });

      const isBlocked = blockedDates.some((bd) => {
        const start = new Date(bd.startDate);
        const end = new Date(bd.endDate);
        return date >= start && date <= end;
      });

      days.push({
        date: dateStr,
        bookings: dayBookings.map((b) => ({
          id: b.id,
          venueName: b.venue.name,
          clientName: b.wedding?.user?.name || 'Unknown',
          status: b.status,
        })),
        isBlocked,
        hasBooking: dayBookings.length > 0,
      });
    }

    return days;
  }

  async getEarnings(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const venueIds = await this.prisma.venue.findMany({
      where: { vendorId: vendor.id },
      select: { id: true },
    });

    // Get all successful payments
    const bookingsWithPayments = await this.prisma.booking.findMany({
      where: {
        venueId: { in: venueIds.map((v) => v.id) },
        status: 'CONFIRMED',
        payment: { status: 'SUCCESS' },
      },
      include: {
        payment: true,
        venue: { select: { name: true } },
        wedding: true,
      },
      orderBy: { weddingDate: 'desc' },
    });

    const totalEarnings = bookingsWithPayments.reduce(
      (sum, b) => sum + (b.payment?.amount || 0),
      0,
    );

    // Calculate monthly breakdown
    const monthlyEarnings: Record<string, number> = {};
    bookingsWithPayments.forEach((b) => {
      const month = new Date(b.createdAt).toISOString().slice(0, 7);
      monthlyEarnings[month] =
        (monthlyEarnings[month] || 0) + (b.payment?.amount || 0);
    });

    return {
      totalEarnings,
      totalBookings: bookingsWithPayments.length,
      monthlyBreakdown: Object.entries(monthlyEarnings)
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => b.month.localeCompare(a.month)),
      recentPayments: bookingsWithPayments.slice(0, 10).map((b) => ({
        id: b.payment?.id,
        amount: b.payment?.amount || 0,
        date: b.payment?.createdAt,
        venueName: b.venue.name,
        weddingDate: b.weddingDate,
      })),
    };
  }

  async updateAvailability(
    userId: string,
    date: string,
    status: 'AVAILABLE' | 'BLOCKED',
  ) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: { venues: { select: { id: true } } },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const dateObj = new Date(date);

    if (status === 'BLOCKED') {
      // Create blocked date entries for all venues
      await Promise.all(
        vendor.venues.map((venue) =>
          this.prisma.venueAvailability.create({
            data: {
              venueId: venue.id,
              startDate: dateObj,
              endDate: dateObj,
            },
          }),
        ),
      );
    } else {
      // Remove blocked date entries
      await this.prisma.venueAvailability.deleteMany({
        where: {
          venueId: { in: vendor.venues.map((v) => v.id) },
          startDate: { lte: dateObj },
          endDate: { gte: dateObj },
        },
      });
    }

    return { success: true, date, status };
  }
}
