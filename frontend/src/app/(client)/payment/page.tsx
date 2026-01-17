'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Building2, 
  Calendar, 
  Loader2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button, Card, CardContent, Skeleton } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useBooking } from '@/features/booking';
import { usePayment } from '@/features/payments';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  
  const { data: booking, isLoading, error } = useBooking(bookingId ?? '');
  const { pay, isProcessing, isSuccess } = usePayment();

  if (!bookingId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">No booking specified</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Booking not found</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If already confirmed/paid
  if (booking.status === 'CONFIRMED') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal mb-2">
            Already Paid!
          </h1>
          <p className="text-muted mb-6">
            This booking has already been confirmed.
          </p>
          <Link href={`/booking/confirmation?id=${bookingId}`}>
            <Button>View Booking Details</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Payment successful
  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted mb-6">
            Your booking has been confirmed.
          </p>
          <Link href={`/booking/confirmation?id=${bookingId}`}>
            <Button>View Confirmation</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const venue = booking.venue;
  const amount = venue?.basePrice || 0;

  const handlePay = () => {
    pay(bookingId, amount);
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-charcoal mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-serif font-semibold text-charcoal mb-6">
          Complete Payment
        </h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Venue Info */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {venue?.images?.[0] ? (
                  <Image
                    src={venue.images[0]}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-charcoal">{venue?.name}</h3>
                <p className="text-sm text-muted">{venue?.city}, {venue?.state}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted">
                  <Calendar className="w-3 h-3" />
                  {formatDate(booking.weddingDate)}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted">Venue Booking</span>
                <span className="text-charcoal">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">GST (18%)</span>
                <span className="text-charcoal">{formatCurrency(amount * 0.18)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-medium text-charcoal">Total</span>
                <span className="text-xl font-semibold text-rani">
                  {formatCurrency(amount * 1.18)}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handlePay}
              disabled={isProcessing}
              leftIcon={
                isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )
              }
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount * 1.18)}`}
            </Button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
              <Shield className="w-4 h-4" />
              <span>Secured by Razorpay • 256-bit SSL encryption</span>
            </div>
          </CardContent>
        </Card>

        {/* Test Mode Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-amber-800 mb-1">🧪 Test Mode</p>
          <p className="text-amber-700">
            Payments are in test mode. No real charges will be made. 
            Click the button above to simulate a successful payment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto py-12 px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
