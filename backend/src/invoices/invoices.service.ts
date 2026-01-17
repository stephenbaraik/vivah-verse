import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking, Venue, Wedding, User, Payment } from '@prisma/client';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

type BookingWithRelations = Booking & {
  venue: Venue;
  wedding: Wedding & { user: User; payments: Payment[] };
};

@Injectable()
export class InvoicesService {
  private readonly GST_RATE = 0.18; // 18% GST

  constructor(private prisma: PrismaService) {}

  private isAdmin(role?: string) {
    return role === 'ADMIN';
  }

  private async assertBookingInvoiceAccess(
    userId: string,
    role: string | undefined,
    bookingId: string,
  ) {
    if (this.isAdmin(role)) return;

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        wedding: true,
        venue: { include: { vendor: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isClient = booking.wedding.userId === userId;
    const isVendor = booking.venue.vendor.userId === userId;

    if (!isClient && !isVendor) {
      throw new ForbiddenException('Access denied');
    }
  }

  async generateInvoice(
    userId: string,
    role: string | undefined,
    bookingId: string,
  ) {
    await this.assertBookingInvoiceAccess(userId, role, bookingId);

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: true,
        wedding: { 
          include: { 
            user: true,
            payments: true,
          } 
        },
        invoice: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // If invoice already exists, return it
    if (booking.invoice) {
      return booking.invoice;
    }

    // Find the successful payment for this wedding
    const payment = booking.wedding.payments.find(p => p.status === 'SUCCESS');
    if (!payment) {
      throw new BadRequestException('No successful payment found for this booking');
    }

    // Calculate GST breakdown - use payment amount (already in rupees)
    const totalAmount = payment.amount * 100; // convert to paise
    const subtotal = Math.round(totalAmount / (1 + this.GST_RATE));
    const gstAmount = totalAmount - subtotal;

    // Generate invoice number
    const invoiceNo = `INV-${Date.now()}-${booking.id.slice(0, 8).toUpperCase()}`;

    // Ensure invoices directory exists
    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Generate PDF
    const pdfFilename = `${invoiceNo}.pdf`;
    const pdfPath = path.join(invoicesDir, pdfFilename);
    await this.createPdfInvoice(
      booking as BookingWithRelations,
      invoiceNo,
      subtotal,
      gstAmount,
      totalAmount,
      pdfPath,
    );

    // Save invoice record
    const invoice = await this.prisma.invoice.create({
      data: {
        bookingId: booking.id,
        invoiceNo,
        subtotal,
        gstAmount,
        totalAmount,
        pdfUrl: `/invoices/${pdfFilename}`,
      },
    });

    return invoice;
  }

  private async createPdfInvoice(
    booking: BookingWithRelations,
    invoiceNo: string,
    subtotal: number,
    gstAmount: number,
    totalAmount: number,
    pdfPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(pdfPath);

      doc.pipe(writeStream);

      // Header
      doc.fontSize(24).text('VIVAH VERSE', { align: 'center' });
      doc.fontSize(12).text('Wedding Marketplace', { align: 'center' });
      doc.moveDown();

      // Invoice details
      doc.fontSize(16).text('TAX INVOICE', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10);
      doc.text(`Invoice No: ${invoiceNo}`);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
      doc.text(`GSTIN: 27AABCU9603R1ZM`); // Placeholder GST number
      doc.moveDown();

      // Customer details
      doc.fontSize(12).text('Bill To:', { underline: true });
      doc.fontSize(10);
      doc.text(`Name: ${booking.wedding?.user?.email || 'Customer'}`);
      doc.text(
        `Wedding Date: ${booking.weddingDate.toLocaleDateString('en-IN')}`,
      );
      doc.moveDown();

      // Venue details
      doc.fontSize(12).text('Venue Details:', { underline: true });
      doc.fontSize(10);
      doc.text(`Venue: ${booking.venue?.name || 'N/A'}`);
      doc.text(`Location: ${booking.venue?.city || 'N/A'}`);
      doc.text(`Capacity: ${booking.venue?.capacity || 'N/A'} guests`);
      doc.moveDown(2);

      // Table header
      doc.fontSize(10);
      const tableTop = doc.y;
      doc.text('Description', 50, tableTop);
      doc.text('Amount (₹)', 400, tableTop, { align: 'right' });
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Table content
      const row1Y = tableTop + 25;
      doc.text('Venue Booking', 50, row1Y);
      doc.text((subtotal / 100).toFixed(2), 400, row1Y, { align: 'right' });

      const row2Y = row1Y + 20;
      doc.text('CGST (9%)', 50, row2Y);
      doc.text((gstAmount / 200).toFixed(2), 400, row2Y, { align: 'right' });

      const row3Y = row2Y + 20;
      doc.text('SGST (9%)', 50, row3Y);
      doc.text((gstAmount / 200).toFixed(2), 400, row3Y, { align: 'right' });

      // Total line
      doc
        .moveTo(50, row3Y + 20)
        .lineTo(550, row3Y + 20)
        .stroke();
      const totalY = row3Y + 30;
      doc.font('Helvetica-Bold').fontSize(12).text('Total:', 50, totalY);
      doc.text(`₹${(totalAmount / 100).toFixed(2)}`, 400, totalY, {
        align: 'right',
      });
      doc.font('Helvetica'); // Reset to regular font

      doc.moveDown(4);

      // GST Summary
      doc.fontSize(10);
      doc.text('GST Summary:', { underline: true });
      doc.text(`Taxable Value: ₹${(subtotal / 100).toFixed(2)}`);
      doc.text(`CGST @ 9%: ₹${(gstAmount / 200).toFixed(2)}`);
      doc.text(`SGST @ 9%: ₹${(gstAmount / 200).toFixed(2)}`);
      doc.text(`Total Tax: ₹${(gstAmount / 100).toFixed(2)}`);

      doc.moveDown(2);

      // Payment details
      const payment = booking.wedding.payments[0];
      if (payment) {
        doc.text('Payment Details:', { underline: true });
        doc.text(
          `Payment ID: ${payment.providerRef || payment.id || 'N/A'}`,
        );
        doc.text(`Status: ${payment.status}`);
      }

      doc.moveDown(2);

      // Footer
      doc
        .fontSize(8)
        .text('This is a computer-generated invoice.', { align: 'center' });
      doc.text('Thank you for choosing Vivah Verse!', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });
  }

  async getInvoiceByBookingId(
    userId: string,
    role: string | undefined,
    bookingId: string,
  ) {
    await this.assertBookingInvoiceAccess(userId, role, bookingId);

    const invoice = await this.prisma.invoice.findUnique({
      where: { bookingId },
      include: { booking: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found for this booking');
    }

    return invoice;
  }

  async getInvoiceById(
    userId: string,
    role: string | undefined,
    invoiceId: string,
  ) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { booking: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    await this.assertBookingInvoiceAccess(userId, role, invoice.bookingId);

    return invoice;
  }
}
