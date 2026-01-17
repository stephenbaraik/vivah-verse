/**
 * Venue API Types
 * Venue listings, search, and availability
 */

import type {
  ID,
  Timestamps,
  PaginationParams,
  PaginatedResponse,
  SortOrder,
} from './common';
import type { Vendor } from './vendor';

/**
 * Venue status
 */
export type VenueStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'INACTIVE';

/**
 * Venue listing
 */
export type Venue = {
  id: ID;
  vendorId: ID;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  pricePerPlate: number;
  basePrice?: number;
  amenities: string[];
  cuisineTypes: string[];
  images: string[];
  status: VenueStatus;
  rating?: number;
  reviewCount: number;
  vendor?: Pick<Vendor, 'id' | 'businessName' | 'status'>;
} & Timestamps;

/**
 * Venue search parameters
 */
export type VenueSearchParams = {
  q?: string;
  city?: string;
  date?: string;
  guests?: number;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  cuisineTypes?: string[];
  sortBy?: 'basePrice' | 'capacity' | 'createdAt';
  sortDir?: SortOrder;
} & PaginationParams;

/**
 * Venue search response
 */
export type VenueSearchResponse = PaginatedResponse<Venue>;

/**
 * Create venue request (vendor only)
 */
export type CreateVenueRequest = {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  pricePerPlate: number;
  amenities?: string[];
  cuisineTypes?: string[];
};

/**
 * Update venue request
 */
export type UpdateVenueRequest = Partial<CreateVenueRequest>;

/**
 * Venue availability status
 */
export type AvailabilityStatus = 'AVAILABLE' | 'BLOCKED' | 'BOOKED';

/**
 * Venue availability record
 */
export type VenueAvailability = {
  id: ID;
  venueId: ID;
  date: string;
  status: AvailabilityStatus;
  bookingId?: ID;
} & Pick<Timestamps, 'createdAt'>;

/**
 * Block date request
 */
export type BlockDateRequest = {
  venueId: ID;
  date: string;
  reason?: string;
};

/**
 * Availability calendar params
 */
export type AvailabilityCalendarParams = {
  startDate: string;
  endDate: string;
};

/**
 * API Endpoints:
 * GET  /venues/search              → VenueSearchResponse
 * GET  /venues/:id                 → Venue
 * POST /venues                     → Venue (vendor)
 * PATCH /venues/:id                → Venue (vendor)
 * DELETE /venues/:id               → void (vendor)
 * GET  /venues/my                  → Venue[] (vendor)
 * POST /venues/:id/images          → { urls: string[] }
 * 
 * Availability:
 * GET  /availability/:venueId/:date → { available: boolean }
 * GET  /availability/:venueId       → VenueAvailability[]
 * POST /availability/block          → VenueAvailability
 * DELETE /availability/:venueId/:date → void
 */
