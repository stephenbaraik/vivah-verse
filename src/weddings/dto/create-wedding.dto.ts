import { IsDateString, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeddingDto {
  @ApiProperty({ example: '2026-02-15' })
  @IsDateString()
  weddingDate: string;

  @ApiProperty({ example: 'Jaipur, Rajasthan' })
  @IsString()
  location: string;

  @ApiProperty({ example: 300 })
  @IsInt()
  @Min(1)
  guestCount: number;

  @ApiProperty({ example: 2500000 })
  @IsInt()
  @Min(0)
  budget: number;
}
