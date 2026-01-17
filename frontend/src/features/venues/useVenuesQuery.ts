'use client';

import { useQuery } from '@tanstack/react-query';
import { VenuesService } from '@/services/venues.service';
import type { VenueSearchParams, VenueSearchResponse } from '@/types/api';

/**
 * Server state hook for venue search
 * Wraps VenuesService with React Query
 */
export function useVenuesQuery(
  params: VenueSearchParams,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery<VenueSearchResponse>({
    queryKey: ['venues', 'search', params],
    queryFn: () => VenuesService.search(params),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes - venues don't change often
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 min
  });
}

/**
 * Hook for featured/popular venues (no filters)
 */
export function useFeaturedVenues(limit = 6) {
  return useQuery<VenueSearchResponse>({
    queryKey: ['venues', 'featured', limit],
    queryFn: () => VenuesService.search({ limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
