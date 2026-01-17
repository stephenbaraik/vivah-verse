import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'Royal Events Co.', description: 'Business name' })
  @IsString()
  @MinLength(2)
  businessName: string;
}
