import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CancellationsService } from './cancellations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CancelBookingDto } from './dto/cancel-booking.dto';

@ApiTags('Cancellations')
@ApiBearerAuth()
@Controller('cancellations')
@UseGuards(JwtAuthGuard)
export class CancellationsController {
  constructor(private cancellationsService: CancellationsService) {}

  @Post()
  @ApiOperation({ summary: 'Cancel a booking and initiate refund' })
  @ApiResponse({ status: 200, description: 'Booking cancelled, refund initiated' })
  @ApiResponse({ status: 400, description: 'Booking not cancellable' })
  cancelBooking(@Req() req, @Body() dto: CancelBookingDto) {
    return this.cancellationsService.cancelBooking(
      req.user.userId,
      dto.bookingId,
      dto.reason,
    );
  }
}
