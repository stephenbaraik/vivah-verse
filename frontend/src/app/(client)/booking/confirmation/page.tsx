'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  MapPin, 
  Phone,
  ArrowRight,
  Users,
  Loader2,
} from 'lucide-react';
import { Button, Card, CardContent, Skeleton } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useBooking, useDownloadInvoice } from '@/features/booking';

const TIMELINE = [
  { date: 'Today', title: 'Booking confirmed', description: 'Your venue is reserved', completed: true },
  { date: '7 days before', title: 'Final payment due', description: 'Complete remaining payment', completed: false },
  { date: '3 days before', title: 'Venue walkthrough', description: 'Meet with venue coordinator', completed: false },
  { date: 'Wedding day', title: 'Your special day', description: 'Your celebration begins!', completed: false },
];

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  
  const { data: booking, isLoading, error } = useBooking(bookingId ?? '');
  const { mutate: downloadInvoice, isPending: isDownloading } = useDownloadInvoice();

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-transparent py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">No booking found</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-transparent py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load booking details</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const venue = booking.venue;
  const weddingDate = booking.weddingDate || booking.wedding?.weddingDate;
  const guestCount = booking.wedding?.guestCount ?? 500;

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-serif font-semibold text-charcoal mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted"
          >
            Your dream wedding is officially on the calendar
          </motion.p>
        </motion.div>

        {/* Booking Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted">Booking ID</span>
                <span className="font-mono text-sm text-charcoal">{booking.id.slice(0, 8).toUpperCase()}</span>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-charcoal/10 relative">
                  {venue?.images?.[0] ? (
                    <Image
                      src={venue.images[0]}
                      alt={venue.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl">🏛️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-semibold text-charcoal">
                    {venue?.name ?? 'Venue'}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <MapPin className="w-4 h-4" />
                    {venue?.city ?? 'City'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-rose-soft rounded-lg mb-6">
                <div>
                  <p className="text-sm text-muted">Wedding Date</p>
                  <p className="font-semibold text-charcoal flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-rani" />
                    {weddingDate ? formatDate(weddingDate) : 'TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted">Guests</p>
                  <p className="font-semibold text-charcoal flex items-center gap-1">
                    <Users className="w-4 h-4 text-rani" />
                    {guestCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-divider">
                <span className="text-muted">Total Amount</span>
                <span className="text-xl font-serif font-semibold text-charcoal">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>

              <Button 
                fullWidth 
                variant="secondary" 
                leftIcon={isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                onClick={() => downloadInvoice(booking.id)}
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download Invoice'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-serif font-semibold text-charcoal mb-4">
                What&apos;s Next
              </h3>
              <div className="space-y-4">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-success text-white' : 'bg-divider text-muted'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm">{idx + 1}</span>
                        )}
                      </div>
                      {idx < TIMELINE.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          item.completed ? 'bg-success' : 'bg-divider'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs text-muted">{item.date}</p>
                      <p className="font-medium text-charcoal">{item.title}</p>
                      <p className="text-sm text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="accent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-charcoal">Need help?</h4>
                  <p className="text-sm text-muted">Our team is here for you</p>
                </div>
                <Button variant="secondary" size="sm" leftIcon={<Phone className="w-4 h-4" />}>
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Go to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link href="/dashboard">
            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-rose-soft py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}