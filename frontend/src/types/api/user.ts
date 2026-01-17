/**
 * User API Types
 * User profile and account types
 */

import type { ID, Timestamps } from './common';

/**
 * User roles in the system
 */
export type UserRole = 'CLIENT' | 'VENDOR' | 'ADMIN';

/**
 * Base user type
 */
export type User = {
  id: ID;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
} & Timestamps;

/**
 * User profile update request
 */
export type UpdateUserRequest = {
  name?: string;
  phone?: string;
};
