/**
 * Auth API Types
 * Authentication and session management
 */

import type { UserRole } from './user';

/**
 * Authenticated user (subset of User for auth context)
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
};

/**
 * Login request payload
 */
export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Login response with tokens
 */
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

/**
 * Registration request payload
 */
export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  role: Extract<UserRole, 'CLIENT' | 'VENDOR'>;
  phone?: string;
};

/**
 * Registration response (same as login)
 */
export type RegisterResponse = LoginResponse;

/**
 * Token refresh request
 */
export type RefreshRequest = {
  refreshToken: string;
};

/**
 * Token refresh response
 */
export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Active session info
 */
export type Session = {
  id: string;
  userAgent: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
  isCurrent?: boolean;
};

/**
 * Password reset request
 */
export type ForgotPasswordRequest = {
  email: string;
};

/**
 * Password reset confirmation
 */
export type ResetPasswordRequest = {
  token: string;
  password: string;
};

/**
 * API Endpoints:
 * POST /auth/login      → LoginResponse
 * POST /auth/register   → RegisterResponse
 * POST /auth/refresh    → RefreshResponse
 * POST /auth/logout     → void
 * POST /auth/logout-all → void
 * GET  /auth/me         → User
 * GET  /auth/sessions   → Session[]
 * DELETE /auth/sessions/:id → void
 */
