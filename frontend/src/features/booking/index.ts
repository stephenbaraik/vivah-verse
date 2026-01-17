'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { BookingsService } from '@/services/bookings.service';
import { useToast } from '@/stores/toast-store';
import type { CreateBookingRequest, CancelBookingRequest, MutationError } from '@/types/api';

/**
 * Bookings feature hooks
 */

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => BookingsService.getMyBookings(),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => BookingsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => BookingsService.create(data),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      addToast({ type: 'success', message: 'Booking created!' });
      router.push(`/booking/confirmation?id=${booking.id}`);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create booking',
      });
    },
  });
}

/** Parameters for cancel booking mutation */
type CancelBookingParams = {
  bookingId: string;
  data?: CancelBookingRequest;
};

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ bookingId, data }: CancelBookingParams) =>
      BookingsService.cancel(bookingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['bookings', variables.bookingId],
      });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      addToast({ type: 'success', message: 'Booking cancelled. Refund initiated.' });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cancel booking',
      });
    },
  });
}

export function useCancellation(bookingId: string) {
  return useQuery({
    queryKey: ['cancellations', bookingId],
    queryFn: () => BookingsService.getCancellation(bookingId),
    enabled: !!bookingId,
  });
}

export function useInvoice(bookingId: string) {
  return useQuery({
    queryKey: ['invoices', bookingId],
    queryFn: () => BookingsService.getInvoice(bookingId),
    enabled: !!bookingId,
  });
}

export function useDownloadInvoice() {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const blob = await BookingsService.downloadInvoice(bookingId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      addToast({ type: 'success', message: 'Invoice downloaded!' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to download invoice' });
    },
  });
}

// Vendor-specific hooks
export function useVendorBookingsList() {
  return useQuery({
    queryKey: ['bookings', 'vendor'],
    queryFn: () => BookingsService.getVendorBookings(),
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (bookingId: string) => BookingsService.confirm(bookingId),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', booking.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'vendor'] });
      addToast({ type: 'success', message: 'Booking confirmed!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to confirm booking',
      });
    },
  });
}
