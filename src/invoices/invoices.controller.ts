import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate/:bookingId')
  @ApiOperation({ summary: 'Generate invoice for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({ status: 201, description: 'Invoice generated' })
  async generateInvoice(@Param('bookingId') bookingId: string) {
    return this.invoicesService.generateInvoice(bookingId);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get invoice by booking ID' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async getInvoiceByBooking(@Param('bookingId') bookingId: string) {
    return this.invoicesService.getInvoiceByBookingId(bookingId);
  }

  @Get(':invoiceId')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  async getInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoicesService.getInvoiceById(invoiceId);
  }

  @Get(':invoiceId/download')
  @ApiOperation({ summary: 'Download invoice PDF' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'PDF file' })
  async downloadInvoice(
    @Param('invoiceId') invoiceId: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.getInvoiceById(invoiceId);

    const pdfFilename = path.basename(invoice.pdfUrl);
    const pdfPath = path.join(process.cwd(), 'invoices', pdfFilename);

    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException('Invoice PDF not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNo}.pdf"`,
    );

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  }
}
