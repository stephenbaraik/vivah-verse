'use client';

import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueAvailabilityPreviewProps {
  isAvailable?: boolean;
  isLoading?: boolean;
  selectedDate?: string;
  onCheckCalendar?: () => void;
  className?: string;
}

/**
 * Availability preview component - shows status for selected date
 */
export function VenueAvailabilityPreview({
  isAvailable = true,
  isLoading = false,
  selectedDate,
  onCheckCalendar,
  className,
}: VenueAvailabilityPreviewProps) {
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={cn(
        'rounded-lg p-5',
        isLoading
          ? 'bg-cream border border-divider'
          : isAvailable
            ? 'bg-success/10 border border-success/30'
            : 'bg-error/10 border border-error/30',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Calendar className="w-6 h-6 text-muted flex-shrink-0" />
        ) : isAvailable ? (
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-error flex-shrink-0" />
        )}
        
        <div className="flex-1">
          <p className="text-sm font-semibold text-charcoal mb-1">
            {isLoading ? 'Checking availability…' : isAvailable ? 'Available' : 'Not Available'}
            {formattedDate && (
              <span className="font-normal text-muted"> on {formattedDate}</span>
            )}
          </p>
          <p className="text-sm text-muted">
            {isLoading
              ? 'Fetching live availability for your selected date.'
              : isAvailable
                ? 'This venue is available for booking. Reserve now to secure your date!'
                : 'This venue is already booked on this date. Try selecting a different date.'}
          </p>
        </div>
      </div>
      
      {onCheckCalendar && (
        <button
          onClick={onCheckCalendar}
          className="mt-4 w-full py-3 border-2 border-dashed border-divider rounded-lg text-sm text-muted hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          View Full Availability Calendar
        </button>
      )}
    </div>
  );
}
