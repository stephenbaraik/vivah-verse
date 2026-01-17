import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConciergeChatContextDto {
  @ApiPropertyOptional({ description: 'Preferred city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Wedding date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Guest count (as string for simplicity)',
  })
  @IsOptional()
  @IsString()
  guests?: string;

  @ApiPropertyOptional({
    description: 'Budget in INR (as string for simplicity)',
  })
  @IsOptional()
  @IsString()
  budget?: string;
}

export class ConciergeChatDto {
  @ApiProperty({ description: 'User message' })
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    description: 'Optional structured context to override parsing',
  })
  @IsOptional()
  context?: ConciergeChatContextDto;
}
