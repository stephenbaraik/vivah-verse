import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/**
 * Generic skeleton loading placeholder
 * Uses CSS animation for pulse effect
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-charcoal/10',
        className
      )}
    />
  );
}
