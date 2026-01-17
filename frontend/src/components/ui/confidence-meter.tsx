'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConfidenceMeterProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConfidenceMeter({
  value,
  label,
  showValue = true,
  size = 'md',
  className,
}: ConfidenceMeterProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const getColor = () => {
    if (clampedValue >= 80) return 'bg-success';
    if (clampedValue >= 50) return 'bg-gold';
    return 'bg-warning';
  };

  const getTextColor = () => {
    if (clampedValue >= 80) return 'text-success';
    if (clampedValue >= 50) return 'text-gold';
    return 'text-warning';
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm text-muted">{label}</span>
          )}
          {showValue && (
            <span className={cn('text-sm font-medium', getTextColor())}>
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-divider rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full', getColor())}
        />
      </div>
    </div>
  );
}

/**
 * Circular confidence indicator
 */
interface CircularConfidenceProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularConfidence({
  value,
  size = 48,
  strokeWidth = 4,
  className,
}: CircularConfidenceProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedValue / 100) * circumference;

  const getColor = () => {
    if (clampedValue >= 80) return 'stroke-success';
    if (clampedValue >= 50) return 'stroke-gold';
    return 'stroke-warning';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-divider"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={getColor()}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-charcoal">
        {clampedValue}%
      </span>
    </div>
  );
}
