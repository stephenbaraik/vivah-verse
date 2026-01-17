'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'ghost';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default:
    'bg-white/55 backdrop-blur-2xl border border-white/40 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glass-hover)]',
  accent:
    'bg-white/58 backdrop-blur-2xl border border-white/40 shadow-[var(--shadow-glass)] border-l-4 border-l-gold/70 hover:shadow-[var(--shadow-glass-hover)]',
  ghost: 'bg-white/30 backdrop-blur-xl border border-white/25',
};

const paddingStyles = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6 md:p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      interactive = false,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseClassName = cn(
      'rounded-2xl transition-all duration-300',
      variantStyles[variant],
      paddingStyles[padding],
      interactive && 'cursor-pointer hover:translate-y-[-2px]',
      className
    );

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.015, boxShadow: 'var(--shadow-glass-hover)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={baseClassName}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold font-serif text-charcoal', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-divider', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
