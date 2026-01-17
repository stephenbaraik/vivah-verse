import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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