import { api } from '@/lib/api';
import type {
  Booking,
  CreateBookingRequest,
  CancelBookingRequest,
  Cancellation,
  Invoice,
} from '@/types/api';

/**
 * Bookings Service
 * Handles all booking-related API calls
 */
export const BookingsService = {
  /**
   * Get all bookings for current user
   */
  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  /**
   * Get booking by ID
   */
  async getById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Create new booking
   */
  async create(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  /**
   * Cancel booking
   * @param bookingId - The booking ID to cancel
   * @param data - Optional cancellation reason
   */
  async cancel(bookingId: string, data?: CancelBookingRequest): Promise<Cancellation> {
    const response = await api.post<Cancellation>(
      `/cancellations/${bookingId}`,
      data
    );
    return response.data;
  },

  /**
   * Get cancellation details
   */
  async getCancellation(bookingId: string): Promise<Cancellation> {
    const response = await api.get<Cancellation>(`/cancellations/${bookingId}`);
    return response.data;
  },

  /**
   * Get invoice for booking
   */
  async getInvoice(bookingId: string): Promise<Invoice> {
    const response = await api.get<Invoice>(`/invoices/booking/${bookingId}`);
    return response.data;
  },

  /**
   * Download invoice PDF
   */
  async downloadInvoice(bookingId: string): Promise<Blob> {
    const response = await api.get(`/invoices/booking/${bookingId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get bookings for vendor
   */
  async getVendorBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings/vendor');
    return response.data;
  },

  /**
   * Confirm booking (vendor action)
   */
  async confirm(bookingId: string): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${bookingId}/confirm`);
    return response.data;
  },
};
