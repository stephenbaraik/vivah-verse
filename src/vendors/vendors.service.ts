import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async createVendor(userId: string, businessName: string) {
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new BadRequestException('Vendor profile already exists');
    }

    return this.prisma.vendor.create({
      data: {
        userId,
        businessName,
        status: 'PENDING',
      },
    });
  }

  async getMyVendorProfile(userId: string) {
    return this.prisma.vendor.findUnique({
      where: { userId },
    });
  }
}
