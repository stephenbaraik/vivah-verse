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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get()
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN, UserRole.CLIENT, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({ status: 200, description: 'Contracts retrieved successfully' })
  findAll(@Query('weddingId') weddingId?: string) {
    return this.contractsService.findAll(weddingId);
  }

  @Get(':id')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN, UserRole.CLIENT, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get a contract by ID' })
  @ApiResponse({ status: 200, description: 'Contract retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a contract' })
  @ApiResponse({ status: 200, description: 'Contract updated successfully' })
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Patch(':id/sign')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Sign a contract' })
  @ApiResponse({ status: 200, description: 'Contract signed successfully' })
  signContract(@Param('id') id: string) {
    return this.contractsService.signContract(id);
  }

  @Delete(':id')
  @Roles(UserRole.PLANNER, UserRole.OPS_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a contract' })
  @ApiResponse({ status: 200, description: 'Contract deleted successfully' })
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
}
