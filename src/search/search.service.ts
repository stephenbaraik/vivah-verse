import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import type { MeiliSearch } from 'meilisearch';
import { PrismaService } from '../prisma/prisma.service';
import { MEILI_CLIENT } from '../infra/infra.module';
import type { SearchVenuesDto } from './dto/search-venues.dto';

const VENUES_INDEX = 'venues';

type VenueDoc = {
  id: string;
  name: string;
  city: string;
  capacity: number;
  basePrice: number;
  pricePerPlate: number | null;
  description: string | null;
  amenities: string[];
  images: string[];
  vendorBusinessName: string;
  createdAt: string;
};

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private venuesIndexReady = false;

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(MEILI_CLIENT)
    private readonly meili: MeiliSearch | null,
  ) {}

  isEnabled() {
    return Boolean(this.meili);
  }

  private async ensureVenuesIndex(): Promise<void> {
    if (!this.meili || this.venuesIndexReady) return;

    try {
      // Create index if missing
      try {
        await this.meili.getIndex(VENUES_INDEX);
      } catch {
        await this.meili
          .createIndex(VENUES_INDEX, { primaryKey: 'id' })
          .waitTask({ timeout: 10_000 });
      }

      const index = this.meili.index(VENUES_INDEX);

      // Settings are idempotent; Meilisearch will create a task
      const task = index.updateSettings({
        searchableAttributes: [
          'name',
          'city',
          'description',
          'amenities',
          'vendorBusinessName',
        ],
        filterableAttributes: ['city', 'capacity', 'basePrice', 'amenities'],
        sortableAttributes: ['basePrice', 'capacity', 'createdAt'],
        rankingRules: [
          'words',
          'typo',
          'proximity',
          'attribute',
          'sort',
          'exactness',
        ],
      });

      await task.waitTask({ timeout: 10_000 });
      this.venuesIndexReady = true;
    } catch (error) {
      // Don’t crash app if search is down
      this.logger.warn(`Meilisearch not ready: ${(error as Error).message}`);
    }
  }

  async reindexVenues(): Promise<
    { indexed: number } | { indexed: number; skipped: true }
  > {
    if (!this.meili) return { indexed: 0, skipped: true };

    await this.ensureVenuesIndex();
    if (!this.venuesIndexReady) return { indexed: 0, skipped: true };

    const venues = await this.prisma.venue.findMany({
      where: {
        vendor: { status: 'APPROVED' },
      },
      include: {
        vendor: { select: { businessName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const docs: VenueDoc[] = venues.map((v) => ({
      id: v.id,
      name: v.name,
      city: v.city,
      capacity: v.capacity,
      basePrice: v.basePrice,
      pricePerPlate: v.pricePerPlate ?? null,
      description: v.description ?? null,
      amenities: v.amenities ?? [],
      images: v.images ?? [],
      vendorBusinessName: v.vendor.businessName,
      createdAt: v.createdAt.toISOString(),
    }));

    try {
      const index = this.meili.index(VENUES_INDEX);
      const task = index.addDocuments(docs);
      await task.waitTask({ timeout: 60_000 });
      return { indexed: docs.length };
    } catch (error) {
      this.logger.warn(`Failed to index venues: ${(error as Error).message}`);
      return { indexed: 0, skipped: true };
    }
  }

  private escapeFilterValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  async searchVenues(params: SearchVenuesDto) {
    const {
      q,
      city,
      guests,
      minPrice,
      maxPrice,
      date,
      amenities,
      sortBy,
      sortDir,
      page = 1,
      limit = 24,
    } = params;

    // If Meilisearch isn’t configured, caller should fall back to Prisma search.
    if (!this.meili) return null;

    await this.ensureVenuesIndex();
    if (!this.venuesIndexReady) return null;

    const filters: string[] = [];
    if (city) filters.push(`city = "${this.escapeFilterValue(city)}"`);
    if (guests) filters.push(`capacity >= ${guests}`);
    if (minPrice !== undefined) filters.push(`basePrice >= ${minPrice}`);
    if (maxPrice !== undefined) filters.push(`basePrice <= ${maxPrice}`);
    if (amenities?.length) {
      const amenityFilters = amenities.map(
        (a) => `amenities = "${this.escapeFilterValue(a)}"`,
      );
      filters.push(amenityFilters.join(' AND '));
    }

    const sortField = sortBy ?? 'createdAt';
    const sortDirection = sortDir ?? 'desc';
    const sort = [`${sortField}:${sortDirection}`];

    const offset = (page - 1) * limit;

    const index = this.meili.index(VENUES_INDEX);
    const result = await index.search<VenueDoc>(q ?? '', {
      filter: filters.length ? filters.join(' AND ') : undefined,
      sort,
      limit,
      offset,
    });

    let hits = result.hits;

    // Optional availability filter: drop venues blocked on the requested date
    if (date) {
      const day = new Date(date);
      const venueIds = hits.map((doc) => doc.id);
      if (venueIds.length) {
        const blocked = await this.prisma.venueAvailability.findMany({
          where: {
            venueId: { in: venueIds },
            startDate: { lte: day },
            endDate: { gte: day },
          },
          select: { venueId: true },
        });
        const blockedSet = new Set(blocked.map((b) => b.venueId));
        hits = hits.filter((doc) => !blockedSet.has(doc.id));
      }
    }

    // Keep response compatible with existing venues search shape
    const total = hits.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data: hits.map((doc) => ({
        id: doc.id,
        name: doc.name,
        city: doc.city,
        capacity: doc.capacity,
        basePrice: doc.basePrice,
        pricePerPlate: doc.pricePerPlate ?? Math.round(doc.basePrice / 100),
        description:
          doc.description ??
          `Beautiful venue in ${doc.city} with capacity for ${doc.capacity} guests.`,
        amenities: doc.amenities?.length
          ? doc.amenities
          : ['Parking', 'AC', 'Catering', 'Decor'],
        images: doc.images?.length
          ? doc.images
          : [
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            ],
        vendor: {
          businessName: doc.vendorBusinessName,
          status: 'APPROVED',
        },
        // preserve UI expectations
        rating: 4.5,
        reviewCount: 120,
        createdAt: doc.createdAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
