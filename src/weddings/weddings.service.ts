import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WeddingsService {
  constructor(private prisma: PrismaService) {}

  async createWedding(userId: string, data: any) {
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
}