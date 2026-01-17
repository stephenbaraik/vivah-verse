/**
 * Admin API Types
 */

/**
 * Admin dashboard stats
 */
export type AdminDashboard = {
  stats: {
    pendingVendors: number;
    activeWeddings: number;
    monthlyRevenue: number;
    totalUsers: number;
    activeVenues: number;
  };
  recentActivity: {
    id: string;
    type: 'vendor_signup' | 'booking' | 'payment' | 'issue';
    message: string;
    createdAt: string;
  }[];
};

/**
 * Pending vendor for approval
 */
export type PendingVendor = {
  id: string;
  userId: string;
  businessName: string;
  contactPerson?: string;
  phone?: string;
  city?: string;
  state?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
  };
  documents?: {
    type: string;
    status: 'uploaded' | 'pending' | 'verified';
    url?: string;
  }[];
};

/**
 * Admin wedding overview
 */
export type AdminWedding = {
  id: string;
  weddingDate: string;
  city: string;
  guestCount: number;
  budget?: number;
  status: 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  clientEmail?: string;
  createdAt: string;
};

/**
 * Issue/complaint ticket
 */
export type Issue = {
  id: string;
  type: 'complaint' | 'refund_request' | 'dispute' | 'other';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  subject: string;
  description: string;
  reportedBy: {
    id: string;
    email: string;
    role: 'CLIENT' | 'VENDOR';
  };
  relatedBookingId?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Pricing rule configuration
 */
export type PricingRule = {
  id: string;
  name: string;
  type: 'commission' | 'markup' | 'discount';
  value: number;
  isPercentage: boolean;
  appliesTo: 'all' | 'venues' | 'vendors' | 'specific';
  isActive: boolean;
};
