import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateVenueDto } from './dto/create-venue.dto';
import { AuthRequest } from '../common/types/auth-request';

@ApiTags('Venues')
@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @ApiOperation({ summary: 'Create a new venue' })
  @ApiResponse({ status: 201, description: 'Venue created' })
  createVenue(@Req() req: AuthRequest, @Body() dto: CreateVenueDto) {
    return this.venuesService.createVenue(req.user.userId, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @ApiOperation({ summary: 'Get my venues' })
  getMyVenues(@Req() req: AuthRequest) {
    return this.venuesService.getMyVenues(req.user.userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search available venues (public)' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'guests', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  searchVenues(
    @Query('city') city?: string,
    @Query('date') date?: string,
    @Query('guests') guests?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.venuesService.searchVenues({
      city,
      date,
      guests: guests ? Number(guests) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get venue by ID (public)' })
  @ApiResponse({ status: 200, description: 'Venue details' })
  getVenue(@Param('id') id: string) {
    return this.venuesService.getVenueById(id);
  }
}
