'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Search, 
  Users, 
  ShoppingBag, 
  ClipboardList,
  CheckCircle,
  type LucideIcon 
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export type EmptyStateType =
  | 'no-venues'
  | 'no-bookings'
  | 'no-listings'
  | 'no-pending'
  | 'no-results'
  | 'all-caught-up'
  | 'no-payments'
  | 'no-weddings';

interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
}

const configs: Record<EmptyStateType, EmptyStateConfig> = {
  'no-venues': {
    icon: MapPin,
    title: 'No venues found',
    description: 'Try adjusting your filters or search in a different location.',
    actionLabel: 'Clear filters',
  },
  'no-bookings': {
    icon: Calendar,
    title: 'No bookings yet',
    description: 'Once you book a venue, it will appear here.',
    actionLabel: 'Browse venues',
  },
  'no-listings': {
    icon: ShoppingBag,
    title: 'No listings yet',
    description: 'Add your first venue or service to start receiving bookings.',
    actionLabel: 'Add listing',
  },
  'no-pending': {
    icon: ClipboardList,
    title: 'No pending approvals',
    description: 'All vendor applications have been reviewed.',
  },
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'We couldn\'t find what you\'re looking for. Try a different search.',
  },
  'all-caught-up': {
    icon: CheckCircle,
    title: 'You\'re all caught up!',
    description: 'No new notifications or tasks requiring your attention.',
  },
  'no-payments': {
    icon: Users,
    title: 'No payments yet',
    description: 'Your payment history will appear here once you make a booking.',
  },
  'no-weddings': {
    icon: Calendar,
    title: 'No weddings planned',
    description: 'Start planning your perfect day by creating a new wedding.',
    actionLabel: 'Create wedding',
  },
};

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  type, 
  icon: customIcon,
  title: customTitle,
  description: customDescription,
  action,
  onAction, 
  className 
}: EmptyStateProps) {
  // Use custom props if provided, otherwise fall back to type config
  const config = type ? configs[type] : null;
  const Icon = customIcon || config?.icon || Search;
  const title = customTitle || config?.title || 'Nothing here';
  const description = customDescription || config?.description || '';
  const actionLabel = config?.actionLabel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-rose-soft flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-rani" />
      </div>
      <h3 className="text-lg font-semibold font-serif text-charcoal mb-2">
        {title}
      </h3>
      <p className="text-muted max-w-sm mb-6">
        {description}
      </p>
      {action || (actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ))}
    </motion.div>
  );
}

/**
 * Skeleton loading states for progressive disclosure
 */
export function VenueCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-card">
      {/* Image placeholder */}
      <div className="h-48 skeleton" />
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title + price */}
        <div className="flex justify-between">
          <div className="h-5 w-32 skeleton rounded" />
          <div className="h-5 w-20 skeleton rounded" />
        </div>
        {/* Details */}
        <div className="h-4 w-24 skeleton rounded" />
        {/* Tags - lazy loaded */}
        <div className="flex gap-2">
          <div className="h-6 w-16 skeleton rounded-full" />
          <div className="h-6 w-20 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-lg bg-white shadow-card p-4 space-y-3">
      <div className="flex gap-4">
        <div className="h-20 w-20 skeleton rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 skeleton rounded" />
          <div className="h-4 w-24 skeleton rounded" />
          <div className="h-4 w-32 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
