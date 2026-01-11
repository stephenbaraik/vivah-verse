import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVendorDto {
  @ApiPropertyOptional({ example: 'Royal Venues Pvt Ltd' })
  @IsOptional()
  @IsString()
  businessName?: string;
}
