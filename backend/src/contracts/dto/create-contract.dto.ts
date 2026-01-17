import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({ description: 'Wedding ID this contract belongs to' })
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Vendor ID for this contract' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Contract terms and conditions' })
  @IsString()
  terms: string;
}

export class UpdateContractDto {
  @ApiPropertyOptional({ description: 'Contract terms and conditions' })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiPropertyOptional({ description: 'Whether the contract is signed' })
  @IsOptional()
  @IsBoolean()
  signed?: boolean;
}