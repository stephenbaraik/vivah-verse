import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request } from 'express';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate payment for a booking' })
  @ApiResponse({ status: 201, description: 'Razorpay order created' })
  initiatePayment(@Req() req, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(
      req.user.userId,
      dto.bookingId,
    );
  }

  // Legacy confirm (for testing without Razorpay)
  @Post('confirm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Confirm payment (legacy/testing)' })
  confirmPayment(@Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(
      dto.paymentId,
      dto.providerRef,
    );
  }

  // Razorpay webhook (NO AUTH - uses signature verification)
  @Post('webhook')
  @SkipThrottle() // Don't rate limit webhooks
  @HttpCode(200)
  @ApiExcludeEndpoint()
  handleWebhook(@Req() req: Request) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const body = JSON.stringify(req.body);

    const signature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== req.headers['x-razorpay-signature']) {
      throw new Error('Invalid webhook signature');
    }

    const event = req.body.event;

    if (event === 'payment.captured') {
      const razorpayOrderId = req.body.payload.payment.entity.order_id;
      const razorpayPaymentId = req.body.payload.payment.entity.id;

      return this.paymentsService.confirmRazorpayPayment(
        razorpayOrderId,
        razorpayPaymentId,
      );
    }

    return { status: 'ok' };
  }
}
