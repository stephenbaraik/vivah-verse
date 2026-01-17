'use client';

import { cn } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';

export type BadgeStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'warning' 
  | 'available' 
  | 'blocked' 
  | 'booked'
  | 'loading'
  | 'success'
  | 'error'
  | 'default';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

const statusConfig: Record<BadgeStatus, {
  icon: typeof Clock;
  bg: string;
  text: string;
  defaultLabel: string;
}> = {
  pending: {
    icon: Clock,
    bg: 'bg-warning/10',
    text: 'text-warning',
    defaultLabel: 'Pending',
  },
  approved: {
    icon: CheckCircle,
    bg: 'bg-success/10',
    text: 'text-success',
    defaultLabel: 'Approved',
  },
  rejected: {
    icon: XCircle,
    bg: 'bg-error/10',
    text: 'text-error',
    defaultLabel: 'Rejected',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    text: 'text-warning',
    defaultLabel: 'Warning',
  },
  available: {
    icon: CheckCircle,
    bg: 'bg-success/10',
    text: 'text-success',
    defaultLabel: 'Available',
  },
  blocked: {
    icon: XCircle,
    bg: 'bg-muted/10',
    text: 'text-muted',
    defaultLabel: 'Blocked',
  },
  booked: {
    icon: CheckCircle,
    bg: 'bg-rani/10',
    text: 'text-rani',
    defaultLabel: 'Booked',
  },
  loading: {
    icon: Loader2,
    bg: 'bg-muted/10',
    text: 'text-muted',
    defaultLabel: 'Loading',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-success/10',
    text: 'text-success',
    defaultLabel: 'Success',
  },
  error: {
    icon: XCircle,
    bg: 'bg-error/10',
    text: 'text-error',
    defaultLabel: 'Error',
  },
  default: {
    icon: Clock,
    bg: 'bg-muted/10',
    text: 'text-muted',
    defaultLabel: 'Draft',
  },
};

export function StatusBadge({ 
  status, 
  label, 
  size = 'md',
  className,
  children
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <Icon 
        className={cn(
          size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
          status === 'loading' && 'animate-spin'
        )} 
      />
      {children || label || config.defaultLabel}
    </span>
  );
}

/**
 * Availability Badge for venues
 */
interface AvailabilityBadgeProps {
  available: boolean;
  date?: string;
  className?: string;
}

export function AvailabilityBadge({ 
  available, 
  date,
  className 
}: AvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        available
          ? 'bg-success/10 text-success'
          : 'bg-error/10 text-error',
        className
      )}
    >
      {available ? (
        <>
          <CheckCircle className="w-3 h-3" />
          {date ? `Available ${date}` : 'Available'}
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          {date ? `Booked ${date}` : 'Unavailable'}
        </>
      )}
    </span>
  );
}
