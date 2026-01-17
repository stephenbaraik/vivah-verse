/**
 * Vendor API Types
 * Vendor profiles and management
 */

import type { ID, Timestamps } from './common';

/**
 * Vendor approval status
 */
export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Vendor service types
 */
export type VendorServiceType =
  | 'VENUE'
  | 'CATERING'
  | 'PHOTOGRAPHY'
  | 'DECORATION'
  | 'MUSIC'
  | 'MAKEUP'
  | 'MEHENDI'
  | 'OTHER';

/**
 * Vendor profile
 */
export type Vendor = {
  id: ID;
  userId: ID;
  businessName: string;
  description?: string;
  city: string;
  state: string;
  serviceType: VendorServiceType;
  status: VendorStatus;
  rating?: number;
  reviewCount?: number;
} & Timestamps;

/**
 * Create vendor request (during onboarding)
 */
export type CreateVendorRequest = {
  businessName: string;
  description?: string;
  city: string;
  state: string;
  serviceType: VendorServiceType;
};

/**
 * Update vendor request
 */
export type UpdateVendorRequest = Partial<CreateVendorRequest>;

/**
 * Vendor document for verification
 */
export type VendorDocument = {
  id: ID;
  type: 'PAN' | 'GST' | 'FSSAI' | 'FIRE_SAFETY' | 'OTHER';
  url: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
};

/**
 * Vendor dashboard stats
 */
export type VendorStats = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  rating: number;
  reviewCount: number;
};

/**
 * Vendor dashboard data (full)
 */
export type VendorDashboard = {
  stats: VendorStats;
  nextBooking?: {
    id: string;
    weddingDate: string;
    venueName: string;
    clientName?: string;
  };
  recentActivity: {
    id: string;
    type: 'booking' | 'payment' | 'review';
    message: string;
    createdAt: string;
  }[];
};

/**
 * Vendor booking item
 */
export type VendorBooking = {
  id: string;
  weddingId: string;
  weddingDate: string;
  venueName: string;
  venueCity?: string;
  clientName?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalAmount: number;
  paidAmount: number;
  payoutAmount: number;
  createdAt: string;
};

/**
 * Vendor earnings data
 */
export type VendorEarnings = {
  total: number;
  paid: number;
  pending: number;
  monthlyBreakdown: {
    month: string;
    amount: number;
  }[];
  recentPayouts: {
    id: string;
    amount: number;
    date: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
  }[];
};

/**
 * Calendar day availability
 */
export type CalendarDay = {
  date: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
  bookingId?: string;
};

/**
 * Admin: Update vendor status
 */
export type UpdateVendorStatusRequest = {
  status: VendorStatus;
  reason?: string;
};

/**
 * API Endpoints:
 * POST  /vendors                    → Vendor
 * GET   /vendors/me                 → Vendor
 * PATCH /vendors/me                 → Vendor
 * GET   /vendors/:id                → Vendor
 * POST  /vendors/documents          → VendorDocument
 * GET   /vendors/stats              → VendorStats
 * 
 * Admin:
 * GET   /admin/vendors/pending      → Vendor[]
 * GET   /admin/vendors              → Vendor[]
 * PATCH /admin/vendors/:id/approve  → Vendor
 * PATCH /admin/vendors/:id/reject   → void
 * GET   /admin/vendors/:id/documents → VendorDocument[]
 */
