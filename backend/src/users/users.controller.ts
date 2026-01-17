import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import type { AuthRequest } from '../common/types/auth-request';

type NotificationPreferences = {
  email?: {
    bookingUpdates?: boolean;
    promotions?: boolean;
    newsletter?: boolean;
  };
  push?: { bookingUpdates?: boolean; messages?: boolean };
  sms?: { bookingReminders?: boolean };
};

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  getProfile(@Req() req: AuthRequest) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed' })
  @ApiResponse({ status: 400, description: 'Current password incorrect' })
  changePassword(@Req() req: AuthRequest, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(
      req.user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  @ApiResponse({ status: 400, description: 'Password incorrect' })
  deleteAccount(@Req() req: AuthRequest, @Body() dto: DeleteAccountDto) {
    return this.usersService.deleteAccount(req.user.userId, dto.password);
  }

  @Get('notifications/preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences' })
  getNotificationPreferences(@Req() req: AuthRequest) {
    return this.usersService.getNotificationPreferences(req.user.userId);
  }

  @Patch('notifications/preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  updateNotificationPreferences(
    @Req() req: AuthRequest,
    @Body() preferences: NotificationPreferences,
  ) {
    return this.usersService.updateNotificationPreferences(
      req.user.userId,
      preferences,
    );
  }
}
