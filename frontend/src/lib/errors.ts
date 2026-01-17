/**
 * VIVAH VERSE - FRONTEND ERROR TAXONOMY
 * Mirrors backend error types for consistent UX
 */

export type ErrorType =
  | 'USER_ACTION_REQUIRED'
  | 'SYSTEM_TEMPORARY'
  | 'PAYMENT_FAILED'
  | 'AI_UNCERTAIN'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND';

export interface AppError {
  type: ErrorType;
  title: string;
  message: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  retryable?: boolean;
}

/**
 * Map HTTP status codes to error types
 */
export function getErrorType(statusCode: number): ErrorType {
  switch (statusCode) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'AUTH_REQUIRED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 402:
      return 'PAYMENT_FAILED';
    case 422:
      return 'USER_ACTION_REQUIRED';
    case 429:
      return 'SYSTEM_TEMPORARY';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'SYSTEM_TEMPORARY';
    default:
      return 'SYSTEM_TEMPORARY';
  }
}

/**
 * User-friendly error messages by type
 */
export const errorMessages: Record<ErrorType, { title: string; message: string }> = {
  USER_ACTION_REQUIRED: {
    title: 'Action Required',
    message: 'Please complete the required information to continue.',
  },
  SYSTEM_TEMPORARY: {
    title: 'Something went wrong',
    message: 'We\'re experiencing temporary issues. Please try again in a moment.',
  },
  PAYMENT_FAILED: {
    title: 'Payment Failed',
    message: 'We couldn\'t process your payment. Please check your details and try again.',
  },
  AI_UNCERTAIN: {
    title: 'AI Suggestion',
    message: 'Our AI isn\'t confident about this recommendation. Please review carefully.',
  },
  NETWORK_ERROR: {
    title: 'Connection Lost',
    message: 'Please check your internet connection and try again.',
  },
  VALIDATION_ERROR: {
    title: 'Invalid Input',
    message: 'Please check the highlighted fields and correct any errors.',
  },
  AUTH_REQUIRED: {
    title: 'Sign In Required',
    message: 'Please sign in to continue.',
  },
  FORBIDDEN: {
    title: 'Access Denied',
    message: 'You don\'t have permission to access this resource.',
  },
  NOT_FOUND: {
    title: 'Not Found',
    message: 'The page or resource you\'re looking for doesn\'t exist.',
  },
};

/**
 * Create an AppError from an API response
 */
export function createAppError(
  statusCode: number,
  serverMessage?: string
): AppError {
  const type = getErrorType(statusCode);
  const defaults = errorMessages[type];
  
  return {
    type,
    title: defaults.title,
    message: serverMessage || defaults.message,
    retryable: type === 'SYSTEM_TEMPORARY' || type === 'NETWORK_ERROR',
  };
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}
