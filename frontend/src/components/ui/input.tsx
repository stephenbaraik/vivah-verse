'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-charcoal mb-1 sm:mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border bg-white',
              'text-sm sm:text-base text-charcoal placeholder:text-muted',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-rani/30 focus:border-rani',
              error
                ? 'border-error focus:ring-error/30 focus:border-error'
                : 'border-divider/50 hover:border-rani/50',
              leftIcon && 'pl-9 sm:pl-10',
              rightIcon && 'pr-9 sm:pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
