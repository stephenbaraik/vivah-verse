'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VenuesService } from '@/services/venues.service';
import { useToast } from '@/stores/toast-store';
import type { VenueSearchParams, CreateVenueRequest, MutationError } from '@/types/api';

// Re-export dedicated hooks
export { useVenueFilters } from './useVenueFilters';
export { useVenuesQuery, useFeaturedVenues } from './useVenuesQuery';

/**
 * Venues feature hooks
 */

export function useVenueSearch(params?: VenueSearchParams) {
  return useQuery({
    queryKey: ['venues', 'search', params],
    queryFn: () => VenuesService.search(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useVenue(id: string) {
  return useQuery({
    queryKey: ['venues', id],
    queryFn: () => VenuesService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useMyVenues() {
  return useQuery({
    queryKey: ['venues', 'my'],
    queryFn: () => VenuesService.getMyVenues(),
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateVenueRequest) => VenuesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', 'my'] });
      addToast({ type: 'success', message: 'Venue created successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create venue',
      });
    },
  });
}

export function useUpdateVenue(id: string) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<CreateVenueRequest>) =>
      VenuesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', id] });
      queryClient.invalidateQueries({ queryKey: ['venues', 'my'] });
      addToast({ type: 'success', message: 'Venue updated!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update venue',
      });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => VenuesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', 'my'] });
      addToast({ type: 'success', message: 'Venue deleted' });
    },
  });
}

export function useCheckAvailability(venueId: string, date: string) {
  return useQuery({
    queryKey: ['availability', venueId, date],
    queryFn: () => VenuesService.checkAvailability(venueId, date),
    enabled: !!venueId && !!date,
    staleTime: 30 * 1000,
  });
}

export function useAvailabilityCalendar(
  venueId: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['availability', 'calendar', venueId, startDate, endDate],
    queryFn: () =>
      VenuesService.getAvailabilityCalendar(venueId, startDate, endDate),
    enabled: !!venueId && !!startDate && !!endDate,
  });
}

export function useBlockDate() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: VenuesService.blockDate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['availability', 'calendar', variables.venueId],
      });
      addToast({ type: 'success', message: 'Date blocked' });
    },
  });
}

export function useUnblockDate() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ venueId, date }: { venueId: string; date: string }) =>
      VenuesService.unblockDate(venueId, date),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['availability', 'calendar', variables.venueId],
      });
      addToast({ type: 'success', message: 'Date unblocked' });
    },
  });
}

export function useUploadVenueImages(venueId: string) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (files: File[]) => VenuesService.uploadImages(venueId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', venueId] });
      addToast({ type: 'success', message: 'Images uploaded!' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to upload images' });
    },
  });
}
