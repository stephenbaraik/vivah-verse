import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Wedding ID for the payment' })
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Amount to pay in rupees' })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Payee user ID (who receives the payment)' })
  @IsUUID()
  payeeId: string;
}
