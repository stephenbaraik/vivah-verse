import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request } from 'express';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import type { AuthRequest } from '../common/types/auth-request';

type RazorpayWebhookBody = {
  event: string;
  payload: {
    payment: {
      entity: {
        order_id: string;
        id: string;
      };
    };
  };
};

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Initiate payment for a booking' })
  @ApiResponse({ status: 201, description: 'Razorpay order created' })
  initiatePayment(@Req() req: AuthRequest, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(req.user.userId, dto.bookingId);
  }

  // Legacy confirm (for testing without Razorpay)
  @Post('confirm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Confirm payment (legacy/testing)' })
  confirmPayment(@Req() req: AuthRequest, @Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(
      req.user.userId,
      dto.paymentId,
      dto.providerRef,
    );
  }

  // Razorpay webhook (NO AUTH - uses signature verification)
  @Post('webhook')
  @SkipThrottle() // Don't rate limit webhooks
  @HttpCode(200)
  @ApiExcludeEndpoint()
  handleWebhook(@Req() req: Request<unknown, unknown, RazorpayWebhookBody>) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const body = JSON.stringify(req.body);

    const signature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const signatureHeader = req.headers['x-razorpay-signature'];
    const headerSignature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    if (signature !== headerSignature) {
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
