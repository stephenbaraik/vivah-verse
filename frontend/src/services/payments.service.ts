import { api } from '@/lib/api';
import type {
  Payment,
  CreatePaymentRequest,
  VerifyPaymentRequest,
} from '@/types/api';

/**
 * Payment initiate response from backend
 */
interface InitiateResponse {
  orderId: string;
  razorpayKey: string;
  amount: number;
  currency: string;
  paymentId: string;
  testMode?: boolean;
  message?: string;
}

/**
 * Payments Service
 * Handles all payment-related API calls (Razorpay integration)
 */
export const PaymentsService = {
  /**
   * Initiate payment - creates Razorpay order
   */
  async initiate(data: CreatePaymentRequest): Promise<{
    payment: Payment;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;
    currency: string;
    paymentId: string;
    testMode?: boolean;
  }> {
    const response = await api.post<InitiateResponse>('/payments/initiate', data);
    const r = response.data;
    return {
      payment: { id: r.paymentId } as Payment,
      razorpayOrderId: r.orderId,
      razorpayKeyId: r.razorpayKey,
      amount: r.amount,
      currency: r.currency,
      paymentId: r.paymentId,
      testMode: r.testMode,
    };
  },

  /**
   * Confirm payment (for test mode)
   */
  async confirm(paymentId: string, providerRef: string): Promise<Payment> {
    const response = await api.post<Payment>('/payments/confirm', {
      paymentId,
      providerRef,
    });
    return response.data;
  },

  /**
   * Verify payment after Razorpay callback
   */
  async verify(data: VerifyPaymentRequest): Promise<Payment> {
    const response = await api.post<Payment>('/payments/verify', data);
    return response.data;
  },

  /**
   * Get payment by ID
   */
  async getById(id: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  /**
   * Get payments for booking
   */
  async getByBooking(bookingId: string): Promise<Payment[]> {
    const response = await api.get<Payment[]>(`/payments/booking/${bookingId}`);
    return response.data;
  },

  /**
   * Get all payments for current user
   */
  async getMyPayments(): Promise<Payment[]> {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },

  /**
   * Request refund
   */
  async requestRefund(paymentId: string): Promise<Payment> {
    const response = await api.post<Payment>(`/payments/${paymentId}/refund`);
    return response.data;
  },
};

/**
 * Razorpay checkout helper
 */
export function openRazorpayCheckout(options: {
  orderId: string;
  keyId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onError: (error: Error) => void;
}) {
  type RazorpaySuccessHandler = (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;

  type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    handler: RazorpaySuccessHandler;
    modal: {
      ondismiss: () => void;
    };
    theme: {
      color: string;
    };
  };

  interface RazorpayInstance {
    open: () => void;
  }

  interface RazorpayConstructor {
    new (options: RazorpayOptions): RazorpayInstance;
  }

  if (typeof window === 'undefined') {
    throw new Error('Razorpay is only available in the browser.');
  }

  const { Razorpay } = window as typeof window & { Razorpay: RazorpayConstructor };

  const razorpay = new Razorpay({
    key: options.keyId,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name || 'Vivah Verse',
    description: options.description || 'Wedding Booking Payment',
    order_id: options.orderId,
    prefill: options.prefill,
    handler: options.onSuccess,
    modal: {
      ondismiss: () => {
        options.onError(new Error('Payment cancelled by user'));
      },
    },
    theme: {
      color: '#C94A6A',
    },
  });

  razorpay.open();
}
