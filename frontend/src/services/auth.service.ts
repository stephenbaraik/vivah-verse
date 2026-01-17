import { api } from '@/lib/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Session,
  User,
} from '@/types/api';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const AuthService = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Logout from all devices
   */
  async logoutAll(): Promise<void> {
    await api.post('/auth/logout-all');
  },

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Get active sessions
   */
  async getSessions(): Promise<Session[]> {
    const response = await api.get<Session[]>('/auth/sessions');
    return response.data;
  },

  /**
   * Revoke specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await api.delete(`/auth/sessions/${sessionId}`);
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password: newPassword });
  },
};
