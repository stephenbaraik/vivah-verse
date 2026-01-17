import { api } from '@/lib/api';
import type {
  Venue,
  VenueSearchParams,
  VenueSearchResponse,
  CreateVenueRequest,
  VenueAvailability,
  BlockDateRequest,
} from '@/types/api';

/**
 * Venues Service
 * Handles all venue-related API calls
 */
export const VenuesService = {
  /**
   * Search venues with filters
   */
  async search(params?: VenueSearchParams): Promise<VenueSearchResponse> {
    const response = await api.get<VenueSearchResponse>('/search/venues', {
      params,
    });
    return response.data;
  },

  /**
   * Get venue by ID
   */
  async getById(id: string): Promise<Venue> {
    const response = await api.get<Venue>(`/venues/${id}`);
    return response.data;
  },

  /**
   * Create new venue (vendor only)
   */
  async create(data: CreateVenueRequest): Promise<Venue> {
    const response = await api.post<Venue>('/venues', data);
    return response.data;
  },

  /**
   * Update venue
   */
  async update(id: string, data: Partial<CreateVenueRequest>): Promise<Venue> {
    const response = await api.patch<Venue>(`/venues/${id}`, data);
    return response.data;
  },

  /**
   * Delete venue
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/venues/${id}`);
  },

  /**
   * Get vendor's venues
   */
  async getMyVenues(): Promise<Venue[]> {
    const response = await api.get<Venue[]>('/venues/me');
    return response.data;
  },

  /**
   * Check availability for specific date
   */
  async checkAvailability(venueId: string, date: string): Promise<boolean> {
    const response = await api.get<{ available: boolean }>(
      `/availability/${venueId}/${date}`
    );
    return response.data.available;
  },

  /**
   * Get availability calendar for venue
   */
  async getAvailabilityCalendar(
    venueId: string,
    startDate: string,
    endDate: string
  ): Promise<VenueAvailability[]> {
    const response = await api.get<VenueAvailability[]>(
      `/availability/${venueId}`,
      { params: { startDate, endDate } }
    );
    return response.data;
  },

  /**
   * Block date (vendor only)
   */
  async blockDate(data: BlockDateRequest): Promise<VenueAvailability> {
    const response = await api.post<VenueAvailability>('/availability/block', data);
    return response.data;
  },

  /**
   * Unblock date (vendor only)
   */
  async unblockDate(venueId: string, date: string): Promise<void> {
    await api.delete(`/availability/${venueId}/${date}`);
  },

  /**
   * Upload venue images
   */
  async uploadImages(venueId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    
    const response = await api.post<{ urls: string[] }>(
      `/venues/${venueId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.urls;
  },
};
