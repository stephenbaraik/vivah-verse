import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateVendorStatusDto } from './dto/update-vendor-status.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('vendors/pending')
  @ApiOperation({ summary: 'Get all pending vendors' })
  getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Patch('vendors/:vendorId/status')
  @ApiOperation({ summary: 'Update vendor approval status' })
  @ApiResponse({ status: 200, description: 'Vendor status updated' })
  updateVendorStatus(
    @Param('vendorId') vendorId: string,
    @Body() dto: UpdateVendorStatusDto,
  ) {
    return this.adminService.updateVendorStatus(vendorId, dto.status);
  }
}
