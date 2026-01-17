'use client';

import { Suspense, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, ChevronRight, ArrowLeft, Heart } from 'lucide-react';
import { useMyWeddings } from '@/features/wedding';
import { useVenue } from '@/features/venues';
import { Button, Card, CardContent, Skeleton } from '@/components/ui';
import { BookingProgress } from '@/components/booking/booking-progress';
import { formatDate, formatCurrency } from '@/lib/utils';

const BOOKING_STEPS: Array<{ id: string; label: string; description?: string }> = [
  { id: 'wedding', label: 'Select wedding' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'payment', label: 'Payment' },
];

const DRAFT_KEY = 'vivah.bookingDraft.v1';

type BookingDraft = {
  venueId: string;
  weddingId: string;
  updatedAt?: number;
};

function WeddingCard({
  wedding,
  onClick,
}: {
  wedding: {
    id: string;
    weddingDate: string;
    city?: string;
    guestCount?: number;
  };
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="cursor-pointer hover:border-rose hover:shadow-md transition-all"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-charcoal font-medium">
                <Calendar className="w-4 h-4 text-rose" />
                <span>{formatDate(wedding.weddingDate)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                {wedding.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {wedding.city}
                  </span>
                )}
                {wedding.guestCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {wedding.guestCount} guests
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WeddingCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function VenueSummary({ venueId }: { venueId: string }) {
  const { data: venue, isLoading } = useVenue(venueId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 p-4 bg-rose-soft rounded-lg">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!venue) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-rose-soft rounded-lg">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-charcoal/10">
        {venue.images?.[0] && (
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </div>
      <div>
        <h3 className="font-medium text-charcoal">{venue.name}</h3>
        <p className="text-sm text-muted">
          {venue.city} · {formatCurrency(venue.pricePerPlate)}/plate
        </p>
      </div>
    </div>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueId = searchParams.get('venueId');

  const draft = useMemo(() => {
    if (!venueId) return null;
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as BookingDraft;
      if (parsed?.venueId === venueId && parsed?.weddingId) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [venueId]);

  const { data: weddings, isLoading, error } = useMyWeddings();

  const resumeUrl = useMemo(() => {
    if (!venueId) return null;
    if (!draft?.weddingId) return null;
    return `/booking/confirm?venueId=${encodeURIComponent(venueId)}&weddingId=${encodeURIComponent(
      draft.weddingId
    )}`;
  }, [draft?.weddingId, venueId]);

  if (!venueId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">No venue selected</p>
        <Button
          variant="secondary"
          onClick={() => router.push('/venues')}
          className="mt-4"
        >
          Browse Venues
        </Button>
      </div>
    );
  }

  const handleSelectWedding = (weddingId: string) => {
    try {
      const nextDraft: BookingDraft = {
        venueId,
        weddingId,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    } catch {
      // ignore
    }
    router.push(`/booking/confirm?venueId=${venueId}&weddingId=${weddingId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-4">
          <BookingProgress steps={BOOKING_STEPS} currentStep={0} variant="compact" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted hover:text-charcoal mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to venue</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-serif font-semibold text-charcoal mb-2">
            Select your wedding
          </h1>
          <p className="text-muted">
            Choose which wedding you&apos;re booking this venue for
          </p>
        </motion.div>

        {/* Venue Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <VenueSummary venueId={venueId} />
        </motion.div>

        {/* Resume banner */}
        {resumeUrl ? (
          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-charcoal">Continue your last booking</p>
                <p className="text-xs text-muted">We saved your progress for this venue.</p>
              </div>
              <Button onClick={() => router.push(resumeUrl)} size="sm">
                Continue
              </Button>
            </div>
          </Card>
        ) : null}

        {/* Wedding List */}
        <div className="space-y-3">
          {isLoading ? (
            <>
              <WeddingCardSkeleton />
              <WeddingCardSkeleton />
            </>
          ) : error ? (
            <Card className="p-6 text-center">
              <p className="text-destructive">Failed to load weddings</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try again
              </Button>
            </Card>
          ) : weddings && weddings.length > 0 ? (
            weddings.map((wedding, index) => (
              <motion.div
                key={wedding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <WeddingCard
                  wedding={wedding}
                  onClick={() => handleSelectWedding(wedding.id)}
                />
              </motion.div>
            ))
          ) : (
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-rose-soft flex items-center justify-center mx-auto mb-4"
              >
                <Heart className="w-8 h-8 text-rani" />
              </motion.div>
              <h3 className="text-lg font-serif font-semibold text-charcoal mb-2">
                Let&apos;s plan your wedding first!
              </h3>
              <p className="text-muted mb-6 text-sm">
                Tell us about your special day so we can help you book the perfect venue
              </p>
              <Button onClick={() => {
                // Save venue intent for after onboarding
                sessionStorage.setItem('pendingVenueId', venueId);
                router.push('/onboarding');
              }}>
                Start Planning
              </Button>
            </Card>
          )}
        </div>

        {/* Info Notice */}
        {weddings && weddings.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-muted text-center mt-8"
          >
            Need to plan another wedding?{' '}
            <button
              onClick={() => router.push('/onboarding')}
              className="text-rose hover:underline"
            >
              Create a new one
            </button>
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="max-w-xl mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64 mb-8" />
            <WeddingCardSkeleton />
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
