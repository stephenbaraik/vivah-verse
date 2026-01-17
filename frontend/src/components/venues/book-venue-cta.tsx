'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { AuthModal } from '@/components/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useWeddingDateStore } from '@/stores/wedding-date-store';
import { formatCurrency } from '@/lib/utils';
import type { Venue } from '@/types/api';

interface BookVenueCTAProps {
  venue: Venue;
  guestCount?: number;
  isAvailable?: boolean;
  isAvailabilityLoading?: boolean;
  selectedDate?: string;
  onViewCalendar?: () => void;
}

/**
 * Sticky booking CTA - conversion core
 * Shows auth modal if user isn't logged in
 */
export function BookVenueCTA({
  venue,
  guestCount: propGuestCount,
  isAvailable = true,
  isAvailabilityLoading = false,
  selectedDate,
  onViewCalendar,
}: BookVenueCTAProps) {
  const handleSave = () => {
    if (!isAuthenticated) {
      setPendingAction('save');
      setShowAuthModal(true);
      return;
    }
    // TODO: Add to favorites API call
    console.log('Save venue:', venue.id);
  };
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { guestCount: storedGuestCount, weddingDate } = useWeddingDateStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'book' | 'save' | null>(null);
  
  // Use stored guest count from date selection flow, or fallback
  const guestCount = propGuestCount || storedGuestCount || 300;
  
  // Calculate estimated total
  const estimatedTotal = venue.pricePerPlate * guestCount;

  const availabilityLabel = useMemo(() => {
    if (!selectedDate) {
      return 'Pick a date to confirm availability';
    }
    if (isAvailabilityLoading) {
      return `Checking ${selectedDate}…`;
    }
    return isAvailable ? `Available on ${selectedDate}` : `Unavailable on ${selectedDate}`;
  }, [isAvailabilityLoading, isAvailable, selectedDate]);

  
  const handleBook = () => {
    if (!isAuthenticated) {
      setPendingAction('book');
      setShowAuthModal(true);
      return;
    }
    // Go directly to booking confirmation step
    const params = new URLSearchParams();
    params.set('venueId', venue.id);
    if (weddingDate) {
      params.set('date', weddingDate.toISOString().split('T')[0]);
    }
    router.push(`/booking/confirm?${params.toString()}`);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: venue.name, url });
        return;
      }
    } catch (e) {
      // ignore
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      // ignore
    }
  };
  
  const handleAuthSuccess = () => {
    // Complete the pending action after successful auth
    if (pendingAction === 'book') {
      const params = new URLSearchParams();
      params.set('venueId', venue.id);
      if (weddingDate) {
        params.set('date', weddingDate.toISOString().split('T')[0]);
      }
      router.push(`/booking/confirm?${params.toString()}`);
    } else if (pendingAction === 'save') {
      // TODO: Add to favorites API call
      console.log('Save venue:', venue.id);
    }
    setPendingAction(null);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider p-4 z-40 shadow-lg md:pb-4 pb-safe">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Estimated total</p>
            <p className="text-xl font-serif font-semibold text-charcoal">
              {formatCurrency(estimatedTotal)}
              <span className="text-sm text-muted font-normal ml-1">
                / {guestCount} guests
              </span>
            </p>

            <div className="mt-1.5 flex items-center gap-2 text-xs text-charcoal/70">
              <span
                className={
                  'inline-flex h-2 w-2 rounded-full ' +
                  (!selectedDate || isAvailabilityLoading
                    ? 'bg-charcoal/30'
                    : isAvailable
                      ? 'bg-green-500'
                      : 'bg-red-500')
                }
                aria-hidden
              />
              <span>{availabilityLabel}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onViewCalendar ? (
              <Button
                type="button"
                variant="outline"
                className="hidden sm:inline-flex gap-2"
                onClick={onViewCalendar}
              >
                <CalendarDays className="h-4 w-4" />
                View calendar
              </Button>
            ) : null}

            <button
              onClick={handleSave}
              className="p-3 rounded-lg border border-divider hover:border-rani hover:bg-rose-soft transition-colors"
              aria-label="Save venue"
            >
              <Heart className="w-5 h-5 text-charcoal" />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-lg border border-divider hover:border-rani hover:bg-rose-soft transition-colors"
              aria-label="Share venue"
            >
              <Share2 className="w-5 h-5 text-charcoal" />
            </button>
            <Button
              size="lg"
              onClick={handleBook}
              disabled={!isAvailable}
            >
              {isAvailable ? 'Start booking' : 'Not Available'}
            </Button>
          </div>
        </div>

        {onViewCalendar ? (
          <div className="mt-3 sm:hidden">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={onViewCalendar}
            >
              <CalendarDays className="h-4 w-4" />
              View calendar
            </Button>
          </div>
        ) : null}
      </div>
      
      {/* Auth Modal - appears when booking/saving without login */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
        contextMessage={
          pendingAction === 'book'
            ? 'Sign in to book this venue and start planning your dream wedding'
            : 'Sign in to save this venue to your favorites'
        }
      />
    </>
  );
}
