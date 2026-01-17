/**
 * Invoice API Types
 * Invoice generation and retrieval
 */

import type { ID, Timestamps } from './common';

/**
 * Invoice record
 */
export type Invoice = {
  id: ID;
  bookingId: ID;
  invoiceNumber: string;
  subtotal: number;
  taxAmount: number;
  gstPercentage: number;
  totalAmount: number;
  pdfUrl?: string;
  issuedAt: string;
} & Timestamps;

/**
 * Invoice line item
 */
export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

/**
 * Detailed invoice with line items
 */
export type InvoiceDetails = Invoice & {
  lineItems: InvoiceLineItem[];
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  vendorDetails: {
    businessName: string;
    gstin?: string;
    address?: string;
  };
};

/**
 * API Endpoints:
 * GET /invoices/booking/:bookingId          → Invoice
 * GET /invoices/booking/:bookingId/download → Blob (PDF)
 * GET /invoices/:invoiceNumber              → InvoiceDetails
 */
