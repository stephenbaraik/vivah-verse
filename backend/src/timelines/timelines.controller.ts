import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TimelinesService } from './timelines.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('timelines')
@Controller('timelines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimelinesController {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Post()
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new timeline milestone' })
  @ApiResponse({ status: 201, description: 'Timeline created successfully' })
  create(@Body() createTimelineDto: CreateTimelineDto) {
    return this.timelinesService.create(createTimelineDto);
  }

  @Get()
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all timeline milestones' })
  @ApiResponse({ status: 200, description: 'Timelines retrieved successfully' })
  findAll(@Query('weddingId') weddingId?: string) {
    return this.timelinesService.findAll(weddingId);
  }

  @Get(':id')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get a timeline milestone by ID' })
  @ApiResponse({ status: 200, description: 'Timeline retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.timelinesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a timeline milestone' })
  @ApiResponse({ status: 200, description: 'Timeline updated successfully' })
  update(@Param('id') id: string, @Body() updateTimelineDto: UpdateTimelineDto) {
    return this.timelinesService.update(id, updateTimelineDto);
  }

  @Delete(':id')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a timeline milestone' })
  @ApiResponse({ status: 200, description: 'Timeline deleted successfully' })
  remove(@Param('id') id: string) {
    return this.timelinesService.remove(id);
  }
}
