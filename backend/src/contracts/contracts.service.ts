import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    return this.prisma.contract.create({
      data: createContractDto,
      include: {
        wedding: true,
        vendor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(weddingId?: string): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: weddingId ? { weddingId } : undefined,
      include: {
        wedding: true,
        vendor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        wedding: true,
        vendor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    try {
      return await this.prisma.contract.update({
        where: { id },
        data: updateContractDto,
        include: {
          wedding: true,
          vendor: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Contract> {
    try {
      return await this.prisma.contract.delete({
        where: { id },
        include: {
          wedding: true,
          vendor: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
  }

  async signContract(id: string): Promise<Contract> {
    try {
      return await this.prisma.contract.update({
        where: { id },
        data: { signed: true },
        include: {
          wedding: true,
          vendor: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
  }
}
