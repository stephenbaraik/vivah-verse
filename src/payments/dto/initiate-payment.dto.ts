import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Booking ID to initiate payment for' })
  @IsUUID()
  bookingId: string;
}
