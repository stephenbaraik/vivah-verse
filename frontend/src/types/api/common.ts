/**
 * Common API Types
 * Foundational types used across all API domains
 */

/**
 * Standard API error shape
 * All errors from backend are normalized to this format
 */
export type ApiError = {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
};

/**
 * Axios error shape with typed response
 * Use in mutation onError handlers
 */
export type MutationError = Error & {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
    status?: number;
  };
};

/**
 * Generic API response wrapper
 * Use when backend returns { data: T } structure
 */
export type ApiResponse<T> = {
  data: T;
  error?: ApiError;
};

/**
 * Paginated response wrapper
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

/**
 * Pagination params for list endpoints
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * Sort direction
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Common timestamp fields
 */
export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

/**
 * ID type (UUID string)
 */
export type ID = string;
