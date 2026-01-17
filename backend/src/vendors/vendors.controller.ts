import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import type { AuthRequest } from '../common/types/auth-request';

@ApiTags('Vendors')
@ApiBearerAuth()
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VENDOR')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create vendor profile' })
  @ApiResponse({ status: 201, description: 'Vendor profile created' })
  createVendor(@Req() req: AuthRequest, @Body() dto: CreateVendorDto) {
    return this.vendorsService.createVendor(req.user.userId, dto.businessName);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my vendor profile' })
  getMyVendor(@Req() req: AuthRequest) {
    return this.vendorsService.getMyVendorProfile(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my vendor profile' })
  updateMyVendor(@Req() req: AuthRequest, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.updateVendorProfile(req.user.userId, dto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get vendor dashboard with stats and upcoming bookings',
  })
  getDashboard(@Req() req: AuthRequest) {
    return this.vendorsService.getDashboard(req.user.userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vendor statistics' })
  getStats(@Req() req: AuthRequest) {
    return this.vendorsService.getStats(req.user.userId);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get vendor bookings list' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getBookings(
    @Req() req: AuthRequest,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.vendorsService.getBookings(req.user.userId, {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get vendor calendar for a month' })
  @ApiQuery({ name: 'month', required: true, description: 'Format: YYYY-MM' })
  getCalendar(@Req() req: AuthRequest, @Query('month') month: string) {
    return this.vendorsService.getCalendar(req.user.userId, month);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Get vendor earnings summary' })
  getEarnings(@Req() req: AuthRequest) {
    return this.vendorsService.getEarnings(req.user.userId);
  }

  @Post('availability')
  @ApiOperation({ summary: 'Update date availability' })
  updateAvailability(
    @Req() req: AuthRequest,
    @Body() body: { date: string; status: 'AVAILABLE' | 'BLOCKED' },
  ) {
    return this.vendorsService.updateAvailability(
      req.user.userId,
      body.date,
      body.status,
    );
  }
}
