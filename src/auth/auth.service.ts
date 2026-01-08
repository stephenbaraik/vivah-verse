import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 30;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔐 Token helpers
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateAccessToken(user: { id: string; email: string; role: UserRole }): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async register(email: string, password: string, role: UserRole, userAgent?: string, ipAddress?: string) {
    // 1️⃣ Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // 4️⃣ Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    // 5️⃣ Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: this.hashToken(refreshToken),
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    // 6️⃣ Return safe response
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 🔄 Refresh tokens with rotation
  async refreshTokens(refreshToken: string) {
    const hashed = this.hashToken(refreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken: hashed,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // 🔁 Rotate refresh token (prevents replay attacks)
    const newRefreshToken = this.generateRefreshToken();

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: this.hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = this.generateAccessToken(session.user);

    console.log({ event: 'TOKEN_REFRESHED', userId: session.userId });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // 🚪 Logout - invalidate all sessions
  async logout(userId: string) {
    const result = await this.prisma.session.deleteMany({
      where: { userId },
    });

    console.log({ event: 'USER_LOGGED_OUT', userId, sessionsRemoved: result.count });

    return { success: true, message: 'All sessions invalidated' };
  }

  // 🚪 Logout single session
  async logoutSession(userId: string, refreshToken: string) {
    const hashed = this.hashToken(refreshToken);

    const result = await this.prisma.session.deleteMany({
      where: {
        userId,
        refreshToken: hashed,
      },
    });

    return { success: result.count > 0 };
  }

  // 📋 Get active sessions (for user to see their devices)
  async getActiveSessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions;
  }
}
