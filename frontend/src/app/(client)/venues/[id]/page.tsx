'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, MapPin, BadgeCheck, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Calendar as AvailabilityCalendar } from '@/components/ui';
import {
  VenueHero,
  VenueQuickFacts,
  WhyThisVenue,
  VenueAvailabilityPreview,
  BookVenueCTA,
  VenueAmenities,
  VenueDescription,
} from '@/components/venues';
import { useVenue } from '@/features/venues';
import { useAvailabilityCalendar, useCheckAvailability } from '@/features/venues';
import { useWeddingDateStore } from '@/stores/wedding-date-store';

/**
 * Loading skeleton for venue detail page
 */
function VenueDetailSkeleton() {
  return (
    <div className="min-h-screen bg-transparent pb-24 animate-pulse">
      <div className="h-[280px] sm:h-[320px] bg-gray-200 rounded-xl" />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
        <div className="h-7 sm:h-8 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="h-20 sm:h-24 bg-gray-200 rounded-lg" />
          <div className="h-20 sm:h-24 bg-gray-200 rounded-lg" />
          <div className="h-20 sm:h-24 bg-gray-200 rounded-lg col-span-2 sm:col-span-1" />
        </div>
        <div className="h-28 sm:h-32 bg-gray-200 rounded-lg" />
        <div className="h-36 sm:h-40 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export default function VenueDetailPage() {
  const params = useParams<{ id: string }>();
  const venueId = params.id;
  
  const { data: venue, isLoading, error } = useVenue(venueId);

  const { weddingDate } = useWeddingDateStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(() => {
    if (!weddingDate) return undefined;
    try {
      return weddingDate.toISOString().slice(0, 10);
    } catch {
      return undefined;
    }
  });

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 7, 0);
    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: toISO(start), endDate: toISO(end) };
  }, []);

  const availabilityQuery = useAvailabilityCalendar(venueId, startDate, endDate);
  const checkAvailabilityQuery = useCheckAvailability(venueId, selectedDate ?? '');

  const calendarDays = useMemo(() => {
    const records = availabilityQuery.data ?? [];
    return records.map((r) => {
      const status: 'available' | 'blocked' | 'booked' =
        r.status === 'BOOKED'
          ? 'booked'
          : r.status === 'BLOCKED'
            ? 'blocked'
            : 'available';
      return {
        date: new Date(r.date),
        status,
        bookingInfo: r.bookingId ? `Booking ${r.bookingId}` : undefined,
      };
    });
  }, [availabilityQuery.data]);

  // Loading state
  if (isLoading) {
    return <VenueDetailSkeleton />;
  }

  // Error state
  if (error || !venue) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
        <Card className="p-6 sm:p-8 text-center max-w-md">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-charcoal mb-2">
            Venue Not Found
          </h2>
          <p className="text-muted text-sm sm:text-base mb-4">
            We couldn&apos;t find this venue. It may have been removed or the link is invalid.
          </p>
          <Link
            href="/venues"
            className="text-rani font-semibold hover:underline text-sm sm:text-base"
          >
            ← Back to venues
          </Link>
        </Card>
      </div>
    );
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: venue.name, url });
        return;
      }
    } catch {
      // Ignore share cancellations
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-24">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="px-3 sm:px-4 pt-3 sm:pt-4"
      >
        <VenueHero venue={venue} />
      </motion.div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-4 sm:space-y-6">
        {/* Title & Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-charcoal">
                {venue.name}
              </h1>
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-muted text-xs sm:text-sm mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  {venue.city}, {venue.state}
                </span>
                {venue.vendor?.businessName && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-2">
                      <span>By {venue.vendor.businessName}</span>
                      {venue.vendor.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/40 backdrop-blur-xl px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-success border border-white/35">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </span>
                      ) : null}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 sm:py-2 rounded-full shadow-sm shrink-0 self-start">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
              <span className="font-semibold text-sm sm:text-base">
                {venue.rating?.toFixed(1) ?? '4.9'}
              </span>
              <span className="text-muted text-xs sm:text-sm">
                ({venue.reviewCount || 234})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-charcoal shadow-sm hover:bg-rose-soft transition-colors"
              aria-label="Share venue"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </motion.div>

        {/* Quick Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <VenueQuickFacts venue={venue} />
        </motion.div>

        {/* AI "Why This Venue" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WhyThisVenue />
        </motion.div>

        {/* Availability Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <VenueAvailabilityPreview
            selectedDate={selectedDate}
            isLoading={!!selectedDate && checkAvailabilityQuery.isLoading}
            isAvailable={checkAvailabilityQuery.data ?? true}
            onCheckCalendar={() => setIsCalendarOpen(true)}
          />
        </motion.div>

        <AnimatePresence>
          {isCalendarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50"
                onClick={() => setIsCalendarOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.2, type: 'spring', bounce: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="w-full max-w-xl bg-white rounded-2xl shadow-elevated overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-divider flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-charcoal">Availability Calendar</h3>
                      <p className="text-sm text-muted">Tap a date to check availability</p>
                    </div>
                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="p-2 rounded-full hover:bg-rose-soft transition-colors"
                      aria-label="Close calendar"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4">
                    <AvailabilityCalendar
                      days={calendarDays}
                      editable={false}
                      onDayClick={(date) => {
                        const iso = date.toISOString().slice(0, 10);
                        setSelectedDate(iso);
                        setIsCalendarOpen(false);
                      }}
                    />
                  </div>

                  <div className="p-4 border-t border-divider flex justify-end">
                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="px-4 py-2 rounded-lg bg-rose-soft text-charcoal hover:bg-rose-soft/70 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VenueDescription venue={venue} />
        </motion.div>

        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <VenueAmenities venue={venue} />
        </motion.div>

        {/* Reviews Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted text-center py-8">
                Reviews coming soon...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sticky Booking CTA */}
      <BookVenueCTA
        venue={venue}
        selectedDate={selectedDate}
        isAvailabilityLoading={!!selectedDate && checkAvailabilityQuery.isLoading}
        isAvailable={selectedDate ? (checkAvailabilityQuery.data ?? true) : true}
        onViewCalendar={() => setIsCalendarOpen(true)}
      />
    </div>
  );
}
