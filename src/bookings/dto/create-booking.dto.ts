import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Wedding ID to book venue for' })
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Venue ID to book' })
  @IsUUID()
  venueId: string;
}
