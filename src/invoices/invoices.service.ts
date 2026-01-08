import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoicesService {
  private readonly GST_RATE = 0.18; // 18% GST

  constructor(private prisma: PrismaService) {}

  async generateInvoice(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: true,
        wedding: { include: { user: true } },
        payment: true,
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

    // Calculate GST breakdown - use venue base price (already in paise)
    const totalAmount = booking.venue.basePrice * 100; // convert to paise
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
    await this.createPdfInvoice(booking, invoiceNo, subtotal, gstAmount, totalAmount, pdfPath);

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
    booking: any,
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
      doc.text(`Wedding Date: ${booking.weddingDate.toLocaleDateString('en-IN')}`);
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
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

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
      doc.moveTo(50, row3Y + 20).lineTo(550, row3Y + 20).stroke();
      const totalY = row3Y + 30;
      doc.font('Helvetica-Bold').fontSize(12).text('Total:', 50, totalY);
      doc.text(`₹${(totalAmount / 100).toFixed(2)}`, 400, totalY, { align: 'right' });
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
      if (booking.payment) {
        doc.text('Payment Details:', { underline: true });
        doc.text(`Payment ID: ${booking.payment.razorpayPaymentId || 'N/A'}`);
        doc.text(`Status: ${booking.payment.status}`);
      }

      doc.moveDown(2);

      // Footer
      doc.fontSize(8).text('This is a computer-generated invoice.', { align: 'center' });
      doc.text('Thank you for choosing Vivah Verse!', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });
  }

  async getInvoiceByBookingId(bookingId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { bookingId },
      include: { booking: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found for this booking');
    }

    return invoice;
  }

  async getInvoiceById(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { booking: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }
}
