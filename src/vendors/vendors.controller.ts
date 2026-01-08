import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateVendorDto } from './dto/create-vendor.dto';

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
  createVendor(@Req() req, @Body() dto: CreateVendorDto) {
    return this.vendorsService.createVendor(req.user.userId, dto.businessName);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my vendor profile' })
  getMyVendor(@Req() req) {
    return this.vendorsService.getMyVendorProfile(req.user.userId);
  }
}
