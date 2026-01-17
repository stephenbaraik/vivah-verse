import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WeddingStatus } from '@prisma/client';

export class UpdateWeddingDto {
  @ApiPropertyOptional({ description: 'Wedding date' })
  @IsOptional()
  @IsDateString()
  weddingDate?: string;

  @ApiPropertyOptional({ description: 'Wedding location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Expected guest count' })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;

  @ApiPropertyOptional({ description: 'Wedding budget' })
  @IsOptional()
  @IsInt()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({ description: 'Assigned planner ID' })
  @IsOptional()
  @IsUUID()
  plannerId?: string;

  @ApiPropertyOptional({ description: 'Wedding status', enum: WeddingStatus })
  @IsOptional()
  @IsEnum(WeddingStatus)
  status?: WeddingStatus;
}
