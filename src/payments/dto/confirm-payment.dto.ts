import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Payment ID' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Provider reference (e.g., Razorpay payment ID)' })
  @IsString()
  providerRef: string;
}
