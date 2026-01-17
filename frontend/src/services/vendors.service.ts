import { api } from '@/lib/api';
import type {
  Vendor,
  CreateVendorRequest,
  VendorStats,
  VendorDashboard,
  VendorBooking,
  VendorEarnings,
  CalendarDay,
} from '@/types/api';

/**
 * Vendors Service
 * Handles all vendor-related API calls
 */
export const VendorsService = {
  /**
   * Get current vendor profile
   */
  async getProfile(): Promise<Vendor> {
    const response = await api.get<Vendor>('/vendors/me');
    return response.data;
  },

  /**
   * Create vendor profile (during onboarding)
   */
  async create(data: CreateVendorRequest): Promise<Vendor> {
    const response = await api.post<Vendor>('/vendors', data);
    return response.data;
  },

  /**
   * Update vendor profile
   */
  async update(data: Partial<CreateVendorRequest>): Promise<Vendor> {
    const response = await api.patch<Vendor>('/vendors/me', data);
    return response.data;
  },

  /**
   * Get vendor by ID (public)
   */
  async getById(id: string): Promise<Vendor> {
    const response = await api.get<Vendor>(`/vendors/${id}`);
    return response.data;
  },

  /**
   * Upload business documents
   */
  async uploadDocuments(files: File[], documentType: string): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    formData.append('type', documentType);

    const response = await api.post<{ urls: string[] }>(
      '/vendors/documents',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.urls;
  },

  /**
   * Get vendor dashboard stats
   */
  async getStats(): Promise<VendorStats> {
    const response = await api.get<VendorStats>('/vendors/stats');
    return response.data;
  },

  /**
   * Get full vendor dashboard data
   */
  async getDashboard(): Promise<VendorDashboard> {
    const response = await api.get<VendorDashboard>('/vendors/dashboard');
    return response.data;
  },

  /**
   * Get vendor bookings list
   */
  async getBookings(params?: {
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    page?: number;
    limit?: number;
  }): Promise<{ bookings: VendorBooking[]; total: number }> {
    const response = await api.get<{ bookings: VendorBooking[]; total: number }>(
      '/vendors/bookings',
      { params }
    );
    return response.data;
  },

  /**
   * Get vendor calendar availability
   */
  async getCalendar(month: string): Promise<CalendarDay[]> {
    const response = await api.get<CalendarDay[]>('/vendors/calendar', {
      params: { month },
    });
    return response.data;
  },

  /**
   * Update availability for a date
   */
  async updateAvailability(
    date: string,
    status: 'AVAILABLE' | 'BLOCKED'
  ): Promise<{ success: boolean; date: string; status: string }> {
    const response = await api.post<{ success: boolean; date: string; status: string }>(
      '/vendors/availability',
      { date, status }
    );
    return response.data;
  },

  /**
   * Get vendor earnings
   */
  async getEarnings(): Promise<VendorEarnings> {
    const response = await api.get<VendorEarnings>('/vendors/earnings');
    return response.data;
  },
};

/**
 * Admin Vendors Service
 * For admin-only vendor management
 */
export const AdminVendorsService = {
  /**
   * Get all pending vendors
   */
  async getPending(): Promise<Vendor[]> {
    const response = await api.get<Vendor[]>('/admin/vendors/pending');
    return response.data;
  },

  /**
   * Get all vendors with filters
   */
  async getAll(params?: {
    approved?: boolean;
    city?: string;
    serviceType?: string;
  }): Promise<Vendor[]> {
    const response = await api.get<Vendor[]>('/admin/vendors', { params });
    return response.data;
  },

  /**
   * Approve vendor
   */
  async approve(vendorId: string): Promise<Vendor> {
    const response = await api.patch<Vendor>(`/admin/vendors/${vendorId}/approve`);
    return response.data;
  },

  /**
   * Reject vendor
   */
  async reject(vendorId: string, reason?: string): Promise<void> {
    await api.patch(`/admin/vendors/${vendorId}/reject`, { reason });
  },

  /**
   * Get vendor documents for review
   */
  async getDocuments(vendorId: string): Promise<{
    type: string;
    url: string;
    uploadedAt: string;
  }[]> {
    const response = await api.get(`/admin/vendors/${vendorId}/documents`);
    return response.data;
  },
};
