import {
  Body,
  Controller,
  Get,
  HttpCode,
  Optional,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VenuesService } from '../venues/venues.service';
import { SearchVenuesDto } from './dto/search-venues.dto';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly search: SearchService,
    private readonly venues: VenuesService,
    @Optional() @InjectQueue('search') private readonly searchQueue?: Queue,
  ) {}

  @Get('venues')
  @ApiOperation({ summary: 'Search venues (Meilisearch when configured)' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'guests', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'amenities', required: false, isArray: true, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['basePrice', 'capacity', 'createdAt'],
  })
  @ApiQuery({ name: 'sortDir', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async venuesSearch(@Query() query: SearchVenuesDto) {
    // If you need date-based availability filtering, use the existing Prisma-backed route:
    // GET /venues/search?date=YYYY-MM-DD
    const meili = await this.search.searchVenues(query);
    if (meili) return meili;

    // Fallback to existing DB search (no full-text q support there yet)
    return this.venues.searchVenues({
      city: query.city,
      guests: query.guests,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      date: query.date,
      amenities: query.amenities,
    });
  }

  @Post('reindex')
  @HttpCode(202)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Reindex search (admin)' })
  async reindex(@Body() body: { target?: 'venues' } = {}) {
    const target = body.target ?? 'venues';

    if (this.searchQueue) {
      await this.searchQueue.add(
        'reindex-venues',
        { target },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 10_000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      return { status: 'queued', target };
    }

    // No Redis configured; run inline
    const result = await this.search.reindexVenues();
    return { status: 'done', target, ...result };
  }

  @Get('status')
  @ApiOperation({ summary: 'Search capability status' })
  status() {
    return { enabled: this.search.isEnabled() };
  }
}
