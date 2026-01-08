import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a venue for a wedding' })
  @ApiResponse({ status: 201, description: 'Venue booked successfully' })
  @ApiResponse({ status: 400, description: 'Venue not available or invalid' })
  bookVenue(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.bookVenue(
      req.user.userId,
      dto.weddingId,
      dto.venueId,
    );
  }
}
