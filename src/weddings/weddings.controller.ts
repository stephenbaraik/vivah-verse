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
export class WeddingsController {
  constructor(private weddingsService: WeddingsService) {}

  @Post()
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Create a wedding' })
  @ApiResponse({ status: 201, description: 'Wedding created' })
  createWedding(@Req() req: AuthRequest, @Body() dto: CreateWeddingDto) {
    return this.weddingsService.createWedding(req.user.userId, dto);
  }

  @Get('my')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Get my weddings' })
  getMyWeddings(@Req() req: AuthRequest) {
    return this.weddingsService.getMyWeddings(req.user.userId);
  }

  @Get('assigned')
  @Roles('PLANNER', 'OPS_MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Get assigned weddings (for planners)' })
  getAssignedWeddings(@Req() req: AuthRequest) {
    return this.weddingsService.getPlannerWeddings(req.user.userId);
  }

  @Get('all')
  @Roles('OPS_MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Get all weddings (for ops managers and admins)' })
  getAllWeddings() {
    return this.weddingsService.getAllWeddings();
  }

  @Patch(':id')
  @Roles('CLIENT', 'PLANNER', 'OPS_MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Update a wedding' })
  @ApiResponse({ status: 200, description: 'Wedding updated' })
  updateWedding(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateWeddingDto,
  ) {
    // For clients, check ownership. For internal users, allow updates.
    if (req.user.role === 'CLIENT') {
      return this.weddingsService.updateWedding(req.user.userId, id, dto);
    }
    // For internal users, allow direct updates
    return this.weddingsService.updateWeddingInternal(id, dto);
  }
}
