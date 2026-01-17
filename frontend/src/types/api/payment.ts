/**
 * Payment API Types
 * Payment processing with Razorpay
 */

import type { ID, Timestamps } from './common';

/**
 * Payment status lifecycle
 */
export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

/**
 * Payment record
 */
export type Payment = {
  id: ID;
  bookingId: ID;
  amount: number;
  status: PaymentStatus;
  provider: 'RAZORPAY';
  providerOrderId?: string;
  providerPaymentId?: string;
  completedAt?: string;
} & Timestamps;

/**
 * Initiate payment request
 */
export type InitiatePaymentRequest = {
  bookingId: ID;
  amount: number;
};

/**
 * Initiate payment response (for Razorpay checkout)
 */
export type InitiatePaymentResponse = {
  payment: Payment;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: 'INR';
};

/**
 * Razorpay checkout callback data
 */
export type RazorpayCallbackData = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

/**
 * Verify payment request
 */
export type VerifyPaymentRequest = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

/**
 * Refund status
 */
export type RefundStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

/**
 * Refund record
 */
export type Refund = {
  id: ID;
  paymentId: ID;
  amount: number;
  status: RefundStatus;
  reason?: string;
  processedAt?: string;
} & Timestamps;

/**
 * API Endpoints:
 * POST /payments/initiate       → InitiatePaymentResponse
 * POST /payments/verify         → Payment
 * GET  /payments/:id            → Payment
 * GET  /payments/booking/:id    → Payment[]
 * GET  /payments                → Payment[] (my payments)
 * POST /payments/:id/refund     → Refund
 * 
 * Webhook (internal):
 * POST /payments/webhook        → void
 */
