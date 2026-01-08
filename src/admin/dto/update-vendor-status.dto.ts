import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VendorStatus } from '@prisma/client';

export class UpdateVendorStatusDto {
  @ApiProperty({ enum: VendorStatus, description: 'New status for the vendor' })
  @IsEnum(VendorStatus)
  status: VendorStatus;
}
