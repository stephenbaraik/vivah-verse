import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateVenueDto } from './dto/create-venue.dto';

interface SearchParams {
  city?: string;
  date?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  async createVenue(userId: string, data: CreateVenueDto) {
    // 1️⃣ Find vendor owned by this user
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new ForbiddenException('Vendor profile not found');
    }

    // Block venue creation for unapproved vendors
    if (vendor.status !== 'APPROVED') {
      throw new ForbiddenException('Vendor not approved yet');
    }

    // 2️⃣ Create venue
    return this.prisma.venue.create({
      data: {
        vendorId: vendor.id,
        name: data.name,
        city: data.city,
        capacity: data.capacity,
        basePrice: data.basePrice,
      },
    });
  }

  async getMyVenues(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new ForbiddenException('Vendor profile not found');
    }

    return this.prisma.venue.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single venue by ID (public)
   */
  async getVenueById(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            businessName: true,
            status: true,
          },
        },
      },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    // Transform to match frontend expectations
    return {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      state: venue.state || 'India',
      address: venue.address || `${venue.city}, India`,
      capacity: venue.capacity,
      basePrice: venue.basePrice,
      pricePerPlate: venue.pricePerPlate || Math.round(venue.basePrice / 100),
      description:
        venue.description ||
        `Beautiful venue in ${venue.city} with capacity for ${venue.capacity} guests.`,
      amenities:
        venue.amenities && venue.amenities.length > 0
          ? venue.amenities
          : ['Parking', 'AC', 'Catering', 'Decor'],
      images:
        venue.images && venue.images.length > 0
          ? venue.images
          : [
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            ],
      rating: 4.5 + Math.random() * 0.5,
      reviewCount: Math.floor(50 + Math.random() * 200),
      vendor: venue.vendor,
      createdAt: venue.createdAt,
    };
  }

  /**
   * Search venues with optional filters (public)
   */
  async searchVenues(params: SearchParams) {
    const { city, date, guests, minPrice, maxPrice, amenities } = params;

    // Build where clause
    const where: Prisma.VenueWhereInput = {
      vendor: {
        status: 'APPROVED',
      },
    };

    if (city) {
      where.city = city;
    }

    if (guests) {
      where.capacity = { gte: guests };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }

    if (amenities?.length) {
      where.amenities = { hasEvery: amenities };
    }

    // If date is provided, filter out blocked dates
    if (date) {
      const dateObj = new Date(date);
      where.availability = {
        none: {
          AND: [{ startDate: { lte: dateObj } }, { endDate: { gte: dateObj } }],
        },
      };
    }

    const venues = await this.prisma.venue.findMany({
      where,
      include: {
        vendor: {
          select: {
            businessName: true,
            status: true,
          },
        },
      },
      orderBy: { basePrice: 'asc' },
      take: 50, // Limit results
    });

    // Transform to match frontend expectations
    const transformed = venues.map((venue) => ({
      id: venue.id,
      name: venue.name,
      city: venue.city,
      state: venue.state || 'India',
      address: venue.address || `${venue.city}, India`,
      capacity: venue.capacity,
      basePrice: venue.basePrice,
      pricePerPlate: venue.pricePerPlate || Math.round(venue.basePrice / 100),
      description:
        venue.description ||
        `Beautiful venue in ${venue.city} with capacity for ${venue.capacity} guests.`,
      amenities:
        venue.amenities && venue.amenities.length > 0
          ? venue.amenities
          : ['Parking', 'AC', 'Catering', 'Decor'],
      images:
        venue.images && venue.images.length > 0
          ? venue.images
          : [
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            ],
      rating: 4.5 + Math.random() * 0.5,
      reviewCount: Math.floor(50 + Math.random() * 200),
      vendor: venue.vendor,
      createdAt: venue.createdAt,
    }));

    return {
      data: transformed,
      total: transformed.length,
      page: 1,
      limit: 50,
      totalPages:
        transformed.length === 0 ? 0 : Math.ceil(transformed.length / 50),
    };
  }

  async searchAvailableVenues(
    city: string,
    weddingDate: string,
    guestCount: number,
  ) {
    return this.searchVenues({
      city,
      date: weddingDate,
      guests: guestCount,
    });
  }
}
