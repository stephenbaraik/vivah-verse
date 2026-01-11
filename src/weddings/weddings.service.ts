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
        city: data.city,
        guestCount: data.guestCount,
        budgetEstimate: data.budgetEstimate,
      },
    });
  }

  async getMyWeddings(userId: string) {
    return this.prisma.wedding.findMany({
      where: { userId },
      orderBy: { weddingDate: 'asc' },
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
        ...(data.city && { city: data.city }),
        ...(data.guestCount !== undefined && { guestCount: data.guestCount }),
      },
    });
  }
}
