'use client';

import { cn } from '@/lib/utils';

interface VenueCardSkeletonProps {
  className?: string;
}

/**
 * Loading skeleton for venue cards
 * Matches VenueCard structure for smooth transition
 */
export function VenueCardSkeleton({ className }: VenueCardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden bg-white shadow-card animate-pulse',
        className
      )}
    >
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title + price row */}
        <div className="flex justify-between items-start">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
        
        {/* Location + capacity row */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        
        {/* Rating + AI badge row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
