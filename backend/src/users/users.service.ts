import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user basic info
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    // Update or create user profile
    if (data.fullName || data.city) {
      await this.prisma.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          fullName: data.fullName || data.name || '',
          phone: data.phone,
          city: data.city,
        },
        update: {
          fullName: data.fullName,
          phone: data.phone,
          city: data.city,
        },
      });
    }

    return updatedUser;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions except current
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return { message: 'Password changed successfully. Please login again.' };
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    // Delete user and all related data (cascades)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }

  getNotificationPreferences(_userId: string) {
    void _userId;
    // For now, return default preferences
    // In a real app, this would be stored in the database
    return {
      email: {
        bookingUpdates: true,
        promotions: false,
        newsletter: true,
      },
      push: {
        bookingUpdates: true,
        messages: true,
      },
      sms: {
        bookingReminders: true,
      },
    };
  }

  updateNotificationPreferences(
    _userId: string,
    preferences: {
      email?: {
        bookingUpdates?: boolean;
        promotions?: boolean;
        newsletter?: boolean;
      };
      push?: { bookingUpdates?: boolean; messages?: boolean };
      sms?: { bookingReminders?: boolean };
    },
  ) {
    void _userId;
    // In a real app, this would be stored in the database
    return {
      message: 'Notification preferences updated',
      preferences,
    };
  }
}
