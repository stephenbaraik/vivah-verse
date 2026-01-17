import { api } from '@/lib/api';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'CLIENT' | 'VENDOR' | 'ADMIN';
  createdAt: string;
  profile?: {
    id: string;
    fullName: string;
    phone?: string;
    city?: string;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  fullName?: string;
  city?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationPreferences {
  email: {
    bookingUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  push: {
    bookingUpdates: boolean;
    messages: boolean;
  };
  sms: {
    bookingReminders: boolean;
  };
}

/**
 * Users Service
 * Handles user profile and settings API calls
 */
export const UsersService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.patch<UserProfile>('/users/me', data);
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/users/change-password', data);
    return response.data;
  },

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>('/users/me', {
      data: { password },
    });
    return response.data;
  },

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<NotificationPreferences>('/users/notifications/preferences');
    return response.data;
  },

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<{ message: string; preferences: NotificationPreferences }> {
    const response = await api.patch('/users/notifications/preferences', preferences);
    return response.data;
  },
};
