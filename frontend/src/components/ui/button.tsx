'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-rani to-rani-dark text-white
    hover:from-rani-light hover:to-rani
    shadow-md shadow-rani/20 hover:shadow-lg hover:shadow-rani/30
  `,
  ai: `
    bg-white/40 backdrop-blur-2xl border border-white/35 text-ink
    shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glass-hover)]
    hover:bg-white/50
  `,
  secondary: `
    bg-transparent border-2 border-gold text-gold
    hover:bg-gold hover:text-white
    hover:shadow-md hover:shadow-gold/20
  `,
  outline: `
    bg-transparent border-2 border-divider text-charcoal
    hover:bg-rose-soft hover:border-rani hover:text-rani
  `,
  ghost: `
    bg-transparent text-charcoal
    hover:bg-rose-soft
  `,
  danger: `
    bg-gradient-to-r from-error to-red-600 text-white
    hover:from-red-500 hover:to-error
    shadow-md shadow-error/20
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-base gap-2 rounded-xl',
  lg: 'px-7 py-3.5 text-lg gap-2.5 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild = false,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseClassName = cn(
      'inline-flex items-center justify-center font-medium rounded-md',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      className
    );

    const commonMotionProps = {
      whileHover: !isDisabled ? { scale: 1.02 } : undefined,
      whileTap: !isDisabled ? { scale: 0.98 } : undefined,
      transition: { duration: 0.12 },
    };

    // Avoid TS conflicts between React DOM drag handlers and framer-motion's onDrag signature.
    const {
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onAnimationStart: _onAnimationStart,
      onAnimationEnd: _onAnimationEnd,
      onAnimationIteration: _onAnimationIteration,
      ...forwardedProps
    } = props;
    void _onDrag;
    void _onDragStart;
    void _onDragEnd;
    void _onAnimationStart;
    void _onAnimationEnd;
    void _onAnimationIteration;

    if (asChild) {
      return (
        <motion.span
          {...commonMotionProps}
          className="inline-flex"
          aria-disabled={isDisabled || undefined}
        >
          <Slot
            ref={ref as unknown as React.Ref<HTMLElement>}
            className={baseClassName}
            {...forwardedProps}
          >
            {children}
          </Slot>
        </motion.span>
      );
    }

    return (
      <motion.button
        {...commonMotionProps}
        ref={ref}
        type={type}
        className={baseClassName}
        disabled={isDisabled}
        {...forwardedProps}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
