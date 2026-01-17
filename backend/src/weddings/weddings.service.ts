import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';

@Injectable()
export class WeddingsService {
  constructor(private prisma: PrismaService) {}

  async createWedding(userId: string, data: CreateWeddingDto) {
    if (new Date(data.weddingDate) < new Date()) {
      throw new BadRequestException('Wedding date must be in the future');
    }

    return this.prisma.wedding.create({
      data: {
        userId,
        weddingDate: new Date(data.weddingDate),
        location: data.location,
        guestCount: data.guestCount,
        budget: data.budget,
      },
      include: {
        planner: true,
        tasks: true,
        timelines: true,
        payments: true,
        contracts: true,
      },
    });
  }

  async getPlannerWeddings(plannerId: string) {
    return this.prisma.wedding.findMany({
      where: { plannerId },
      include: {
        user: true, // couple
        planner: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        timelines: true,
        payments: {
          include: {
            payer: true,
            payee: true,
          },
        },
        contracts: {
          include: {
            vendor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { weddingDate: 'asc' },
    });
  }

  async updateWeddingInternal(weddingId: string, data: UpdateWeddingDto) {
    // Validate new wedding date if provided
    if (data.weddingDate && new Date(data.weddingDate) < new Date()) {
      throw new BadRequestException('Wedding date must be in the future');
    }

    return this.prisma.wedding.update({
      where: { id: weddingId },
      data: {
        ...(data.weddingDate && { weddingDate: new Date(data.weddingDate) }),
        ...(data.location && { location: data.location }),
        ...(data.guestCount !== undefined && { guestCount: data.guestCount }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.plannerId !== undefined && { plannerId: data.plannerId }),
        ...(data.status && { status: data.status }),
      },
      include: {
        planner: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        timelines: true,
        payments: {
          include: {
            payer: true,
            payee: true,
          },
        },
        contracts: {
          include: {
            vendor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async updateWedding(
    userId: string,
    weddingId: string,
    data: UpdateWeddingDto,
  ) {
    // Find the wedding and verify ownership
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    if (wedding.userId !== userId) {
      throw new ForbiddenException('You can only update your own weddings');
    }

    // Validate new wedding date if provided
    if (data.weddingDate && new Date(data.weddingDate) < new Date()) {
      throw new BadRequestException('Wedding date must be in the future');
    }

    return this.prisma.wedding.update({
      where: { id: weddingId },
      data: {
        ...(data.weddingDate && { weddingDate: new Date(data.weddingDate) }),
        ...(data.location && { location: data.location }),
        ...(data.guestCount !== undefined && { guestCount: data.guestCount }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.plannerId !== undefined && { plannerId: data.plannerId }),
        ...(data.status && { status: data.status }),
      },
      include: {
        planner: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        timelines: true,
        payments: {
          include: {
            payer: true,
            payee: true,
          },
        },
        contracts: {
          include: {
            vendor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async getMyWeddings(userId: string) {
    return this.prisma.wedding.findMany({
      where: { userId },
      include: {
        planner: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        timelines: true,
        payments: {
          include: {
            payer: true,
            payee: true,
          },
        },
        contracts: {
          include: {
            vendor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { weddingDate: 'asc' },
    });
  }

  async getAllWeddings() {
    return this.prisma.wedding.findMany({
      include: {
        user: true,
        planner: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        timelines: true,
        payments: {
          include: {
            payer: true,
            payee: true,
          },
        },
        contracts: {
          include: {
            vendor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { weddingDate: 'asc' },
    });
  }
}
