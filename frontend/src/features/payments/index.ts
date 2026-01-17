'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentsService, openRazorpayCheckout } from '@/services/payments.service';
import { useToast } from '@/stores/toast-store';
import { useAuthStore } from '@/stores/auth-store';
import type { CreatePaymentRequest, MutationError } from '@/types/api';

/**
 * Payments feature hooks
 */

export function usePayment() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateMutation = useMutation({
    mutationFn: (data: CreatePaymentRequest) => PaymentsService.initiate(data),
  });

  const confirmMutation = useMutation({
    mutationFn: ({ paymentId, providerRef }: { paymentId: string; providerRef: string }) =>
      PaymentsService.confirm(paymentId, providerRef),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      addToast({ type: 'success', message: 'Payment successful!' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Payment confirmation failed' });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: PaymentsService.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      addToast({ type: 'success', message: 'Payment successful!' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Payment verification failed' });
    },
  });

  const pay = async (bookingId: string, amount: number) => {
    setIsProcessing(true);
    try {
      // 1. Initiate payment - get Razorpay order or test mode data
      const result = await initiateMutation.mutateAsync({ bookingId, amount });

      // TEST MODE: Confirm payment directly without Razorpay
      if (result.testMode) {
        await confirmMutation.mutateAsync({
          paymentId: result.paymentId,
          providerRef: result.razorpayOrderId, // Use orderId as providerRef
        });
        setIsProcessing(false);
        return;
      }

      // LIVE MODE: Open Razorpay checkout
      openRazorpayCheckout({
        orderId: result.razorpayOrderId,
        keyId: result.razorpayKeyId,
        amount: result.amount,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        onSuccess: async (response) => {
          // 3. Verify payment
          await verifyMutation.mutateAsync({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          setIsProcessing(false);
        },
        onError: (error) => {
          addToast({ type: 'error', message: error.message });
          setIsProcessing(false);
        },
      });
    } catch (error) {
      const err = error as MutationError;
      addToast({
        type: 'error',
        message: err.response?.data?.message || 'Payment initiation failed',
      });
      setIsProcessing(false);
    }
  };

  return {
    pay,
    isProcessing,
    isSuccess: verifyMutation.isSuccess || confirmMutation.isSuccess,
  };
}

export function useRefund() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (paymentId: string) => PaymentsService.requestRefund(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      addToast({ type: 'success', message: 'Refund initiated' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Refund failed',
      });
    },
  });
}
