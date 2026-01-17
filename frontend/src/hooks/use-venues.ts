import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/stores/toast-store';

// Types
export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  pricePerPlate: number;
  vegetarian: boolean;
  photos: string[];
  amenities: string[];
  description?: string;
  createdAt: string;
}

export interface VenueFilters {
  city?: string;
  state?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  vegetarian?: boolean;
}

interface CreateVenueData {
  name: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  pricePerPlate: number;
  vegetarian: boolean;
  amenities: string[];
  description?: string;
}

// API Functions
async function getVenues(filters?: VenueFilters): Promise<Venue[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  const response = await api.get(`/venues?${params.toString()}`);
  return response.data;
}

async function getVenue(id: string): Promise<Venue> {
  const response = await api.get(`/venues/${id}`);
  return response.data;
}

async function createVenue(data: CreateVenueData): Promise<Venue> {
  const response = await api.post('/venues', data);
  return response.data;
}

async function checkAvailability(venueId: string, date: string): Promise<boolean> {
  const response = await api.get(`/availability/${venueId}/check?date=${date}`);
  return response.data.available;
}

// Hooks
export function useVenues(filters?: VenueFilters) {
  return useQuery({
    queryKey: ['venues', filters],
    queryFn: () => getVenues(filters),
  });
}

export function useVenue(id: string) {
  return useQuery({
    queryKey: ['venues', id],
    queryFn: () => getVenue(id),
    enabled: !!id,
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      toast.success('Venue created', 'Your venue is now live!');
    },
    onError: () => {
      toast.error('Failed to create venue', 'Please try again.');
    },
  });
}

export function useCheckAvailability(venueId: string, date: string) {
  return useQuery({
    queryKey: ['availability', venueId, date],
    queryFn: () => checkAvailability(venueId, date),
    enabled: !!venueId && !!date,
  });
}
