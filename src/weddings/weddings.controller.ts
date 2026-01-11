import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { WeddingsService } from './weddings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';
import type { AuthRequest } from '../common/types/auth-request';

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
  createWedding(@Req() req: AuthRequest, @Body() dto: CreateWeddingDto) {
    return this.weddingsService.createWedding(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my weddings' })
  getMyWeddings(@Req() req: AuthRequest) {
    return this.weddingsService.getMyWeddings(req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wedding' })
  @ApiResponse({ status: 200, description: 'Wedding updated' })
  updateWedding(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateWeddingDto,
  ) {
    return this.weddingsService.updateWedding(req.user.userId, id, dto);
  }
}
