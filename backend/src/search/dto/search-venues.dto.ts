import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsArray,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PriceRange', async: false })
class PriceRange implements ValidatorConstraintInterface {
  validate(value: number | undefined, args: ValidationArguments) {
    const { minPrice } = args.object as { minPrice?: number };
    if (value === undefined || minPrice === undefined) return true;
    return minPrice <= value;
  }

  defaultMessage() {
    return 'minPrice cannot be greater than maxPrice';
  }
}

export class SearchVenuesDto {
  @ApiPropertyOptional({ description: 'Full-text query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Minimum capacity required' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(1)
  guests?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  @Validate(PriceRange)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Desired event date (YYYY-MM-DD)', format: 'date' })
  @IsOptional()
  @IsISO8601({ strict: true })
  date?: string;

  @ApiPropertyOptional({ description: 'Filter by amenities', type: [String] })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    return String(value)
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['basePrice', 'capacity', 'createdAt'],
    default: 'createdAt',
  })
  @Transform(({ value }) => value ?? 'createdAt')
  @IsIn(['basePrice', 'capacity', 'createdAt'])
  sortBy: 'basePrice' | 'capacity' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @Transform(({ value }) => value ?? 'desc')
  @IsIn(['asc', 'desc'])
  sortDir: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 24, maximum: 50 })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 24))
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 24;

  // Note: date filtering is intentionally not supported in Meilisearch results
  // because availability is modeled in a separate table.
}
