import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class BlockVenueDatesDto {
  @ApiProperty({ example: '56079fec-25ca-43d4-b5db-a83d6cb34ebd' })
  @IsString()
  venueId: string;

  @ApiProperty({ example: '2026-02-14', description: 'Start date to block' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-02-15', description: 'End date to block' })
  @IsDateString()
  endDate: string;
}
