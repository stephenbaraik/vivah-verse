import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import type { AuthRequest } from '../common/types/auth-request';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my bookings' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  getMyBookings(@Req() req: AuthRequest) {
    return this.bookingsService.getMyBookings(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  getBooking(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.bookingsService.getBookingById(req.user.userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Book a venue for a wedding' })
  @ApiResponse({ status: 201, description: 'Venue booked successfully' })
  @ApiResponse({ status: 400, description: 'Venue not available or invalid' })
  bookVenue(@Req() req: AuthRequest, @Body() dto: CreateBookingDto) {
    return this.bookingsService.bookVenue(
      req.user.userId,
      dto.weddingId,
      dto.venueId,
    );
  }
}
