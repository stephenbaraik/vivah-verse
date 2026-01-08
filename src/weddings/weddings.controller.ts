import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WeddingsService } from './weddings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateWeddingDto } from './dto/create-wedding.dto';

@ApiTags('Weddings')
@ApiBearerAuth()
@Controller('weddings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
export class WeddingsController {
  constructor(private weddingsService: WeddingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a wedding' })
  @ApiResponse({ status: 201, description: 'Wedding created' })
  createWedding(@Req() req, @Body() dto: CreateWeddingDto) {
    return this.weddingsService.createWedding(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my weddings' })
  getMyWeddings(@Req() req) {
    return this.weddingsService.getMyWeddings(req.user.userId);
  }
}