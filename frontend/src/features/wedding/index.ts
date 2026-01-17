'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { WeddingsService } from '@/services/weddings.service';
import { useToast } from '@/stores/toast-store';
import type { CreateWeddingRequest, UpdateWeddingRequest, MutationError } from '@/types/api';

/**
 * Wedding feature hooks
 */

/**
 * Fetch all weddings for current user
 */
export function useMyWeddings() {
  return useQuery({
    queryKey: ['weddings', 'my'],
    queryFn: () => WeddingsService.getMyWeddings(),
  });
}

/**
 * Fetch single wedding (first one - for backward compatibility)
 */
export function useMyWedding() {
  const query = useQuery({
    queryKey: ['wedding', 'my'],
    queryFn: () => WeddingsService.getMyWedding(),
    retry: false, // Don't retry if wedding doesn't exist
  });
  
  return {
    ...query,
    mutate: query.refetch, // Alias refetch as mutate for SWR-like API
  };
}

export function useCreateWedding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateWeddingRequest) => WeddingsService.create(data),
    onSuccess: (wedding) => {
      queryClient.invalidateQueries({ queryKey: ['wedding'] });
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
      addToast({ type: 'success', message: 'Wedding details saved!' });
      
      // Check if there's a pending venue booking
      const pendingVenueId = typeof window !== 'undefined' 
        ? sessionStorage.getItem('pendingVenueId') 
        : null;
      
      if (pendingVenueId) {
        sessionStorage.removeItem('pendingVenueId');
        // Redirect directly to booking confirmation with the new wedding
        router.push(`/booking/confirm?venueId=${pendingVenueId}&weddingId=${wedding.id}`);
      } else {
        router.push('/concierge');
      }
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save wedding details',
      });
    },
  });
}

export function useUpdateWedding() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ weddingId, data }: { weddingId: string; data: UpdateWeddingRequest }) => 
      WeddingsService.update(weddingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding'] });
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
      addToast({ type: 'success', message: 'Wedding details updated!' });
    },
  });
}

export function useAuspiciousDates(month: number, year: number) {
  return useQuery({
    queryKey: ['wedding', 'auspicious-dates', month, year],
    queryFn: () => WeddingsService.getAuspiciousDates(month, year),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - dates don't change
  });
}

export function useWeddingDashboard() {
  return useQuery({
    queryKey: ['wedding', 'dashboard'],
    queryFn: () => WeddingsService.getDashboard(),
  });
}

/**
 * Fetch weddings assigned to current planner
 */
export function useAssignedWeddings() {
  return useQuery({
    queryKey: ['weddings', 'assigned'],
    queryFn: () => WeddingsService.getAssignedWeddings(),
  });
}

/**
 * Fetch all weddings (admin only)
 */
export function useAllWeddings() {
  return useQuery({
    queryKey: ['weddings', 'all'],
    queryFn: () => WeddingsService.getAllWeddings(),
  });
}

/**
 * Fetch wedding by ID
 */
export function useWedding(weddingId: string) {
  return useQuery({
    queryKey: ['wedding', weddingId],
    queryFn: () => WeddingsService.getById(weddingId),
    enabled: !!weddingId,
  });
}
