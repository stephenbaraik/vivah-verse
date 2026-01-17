import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BlockDatesDto } from './dto/block-date.dto';
import { BlockVenueDatesDto } from './dto/block-venue-dates.dto';
import type { AuthRequest } from '../common/types/auth-request';

@Controller('availability')
@ApiTags('Availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get(':venueId')
  @ApiOperation({ summary: 'Get venue availability (public)' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Optional start date (YYYY-MM-DD) to filter blocks',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Optional end date (YYYY-MM-DD) to filter blocks',
  })
  getAvailability(
    @Param('venueId') venueId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.availabilityService.getVenueAvailability(
      venueId,
      startDate,
      endDate,
    );
  }

  @Get(':venueId/:date')
  @ApiOperation({ summary: 'Check availability for a specific date (public)' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  @ApiParam({ name: 'date', description: 'Date (YYYY-MM-DD)' })
  checkAvailability(
    @Param('venueId') venueId: string,
    @Param('date') date: string,
  ) {
    return this.availabilityService.checkDateAvailability(venueId, date);
  }

  @Post(':venueId/block')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @ApiOperation({ summary: 'Block dates for a venue' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  blockDates(
    @Req() req: AuthRequest,
    @Param('venueId') venueId: string,
    @Body() dto: BlockDatesDto,
  ) {
    return this.availabilityService.blockDates(
      req.user.userId,
      venueId,
      dto.startDate,
      dto.endDate,
    );
  }

  @Post('block')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @ApiOperation({ summary: 'Block dates for a venue (vendor only)' })
  blockDatesBody(@Req() req: AuthRequest, @Body() dto: BlockVenueDatesDto) {
    return this.availabilityService.blockDates(
      req.user.userId,
      dto.venueId,
      dto.startDate,
      dto.endDate,
    );
  }

  @Delete(':venueId/:date')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @ApiOperation({ summary: 'Unblock a date (vendor only)' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  @ApiParam({ name: 'date', description: 'Date (YYYY-MM-DD)' })
  async unblockDate(
    @Req() req: AuthRequest,
    @Param('venueId') venueId: string,
    @Param('date') date: string,
  ) {
    await this.availabilityService.unblockDate(req.user.userId, venueId, date);
  }
}
