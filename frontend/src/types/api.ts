/**
 * API Types - Re-exports from organized modules
 * @deprecated Import directly from '@/types/api' (the index barrel)
 * 
 * This file exists for backward compatibility with existing imports.
 * New code should import from '@/types/api' directory.
 */

// Re-export everything from the new organized types
export * from './api/index';

// ============ Legacy Aliases ============
// These exist for backward compatibility with existing code

import type { LoginResponse, User as NewUser, InitiatePaymentRequest } from './api/index';

/** @deprecated Use LoginResponse instead */
export type AuthResponse = LoginResponse;

/** @deprecated Use User from './api/user' instead */
export type User = NewUser;

/** @deprecated Use InitiatePaymentRequest instead */
export type CreatePaymentRequest = InitiatePaymentRequest;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
