/**
 * Booking API Types
 * Booking management and lifecycle
 */

import type { ID, Timestamps } from './common';
import type { Venue } from './venue';
import type { Wedding } from './wedding';

/**
 * Booking status lifecycle
 */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

/**
 * Booking record
 */
export type Booking = {
  id: ID;
  weddingId: ID;
  venueId: ID;
  status: BookingStatus;
  weddingDate: string;
  totalAmount: number;
  paidAmount: number;
  venue?: Venue;
  wedding?: Wedding;
} & Timestamps;

/**
 * Create booking request
 */
export type CreateBookingRequest = {
  weddingId: ID;
  venueId: ID;
};

/**
 * Booking with full details
 */
export type BookingDetails = Booking & {
  venue: Venue;
  wedding: Wedding;
  payments: {
    id: ID;
    amount: number;
    status: string;
    createdAt: string;
  }[];
};

/**
 * Cancellation record
 */
export type Cancellation = {
  id: ID;
  bookingId: ID;
  reason?: string;
  refundAmount: number;
  refundStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
};

/**
 * Cancel booking request
 */
export type CancelBookingRequest = {
  reason?: string;
};

/**
 * API Endpoints:
 * POST /bookings                → Booking
 * GET  /bookings                → Booking[] (my bookings)
 * GET  /bookings/:id            → BookingDetails
 * GET  /bookings/vendor         → Booking[] (vendor's bookings)
 * PATCH /bookings/:id/confirm   → Booking (vendor)
 * 
 * Cancellation:
 * POST /cancellations/:bookingId → Cancellation
 * GET  /cancellations/:bookingId → Cancellation
 */
