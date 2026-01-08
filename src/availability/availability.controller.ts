import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BlockDatesDto } from './dto/block-date.dto';

@ApiTags('Availability')
@ApiBearerAuth()
@Controller('availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VENDOR')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post(':venueId/block')
  @ApiOperation({ summary: 'Block dates for a venue' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  blockDates(
    @Req() req,
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

  @Get(':venueId')
  @ApiOperation({ summary: 'Get venue availability' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  getAvailability(@Param('venueId') venueId: string) {
    return this.availabilityService.getVenueAvailability(venueId);
  }
}
