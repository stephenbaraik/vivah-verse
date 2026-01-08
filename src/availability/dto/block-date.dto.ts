import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockDatesDto {
  @ApiProperty({ example: '2026-02-14', description: 'Start date to block' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-02-15', description: 'End date to block' })
  @IsDateString()
  endDate: string;
}
