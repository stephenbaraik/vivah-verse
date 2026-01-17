import { api } from '@/lib/api';
import type { Invoice, InvoiceDetails } from '@/types/api';

/**
 * Invoices Service
 * Handles invoice retrieval and download
 */
export const InvoicesService = {
  /**
   * Get invoice for booking
   * GET /invoices/booking/:bookingId → Invoice
   */
  async getByBooking(bookingId: string): Promise<Invoice> {
    const response = await api.get<Invoice>(`/invoices/booking/${bookingId}`);
    return response.data;
  },

  /**
   * Get invoice by invoice number
   * GET /invoices/:invoiceNumber → InvoiceDetails
   */
  async getByNumber(invoiceNumber: string): Promise<InvoiceDetails> {
    const response = await api.get<InvoiceDetails>(`/invoices/${invoiceNumber}`);
    return response.data;
  },

  /**
   * Download invoice PDF
   * GET /invoices/booking/:bookingId/download → Blob
   */
  async download(bookingId: string): Promise<Blob> {
    const response = await api.get(`/invoices/booking/${bookingId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Helper: Trigger browser download
   */
  async downloadAndSave(bookingId: string, filename?: string): Promise<void> {
    const blob = await this.download(bookingId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `invoice-${bookingId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
