import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWeddingDto {
  @ApiPropertyOptional({ description: 'Wedding date' })
  @IsOptional()
  @IsDateString()
  weddingDate?: string;

  @ApiPropertyOptional({ description: 'Wedding city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Expected guest count' })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;
}
