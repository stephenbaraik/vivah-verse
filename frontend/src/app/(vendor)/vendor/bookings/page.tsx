'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Button,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { useVendorBookings } from '@/features/vendors';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
} from 'lucide-react';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  PENDING: {
    label: 'Pending',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'text-success',
    bgColor: 'bg-success/10',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-error',
    bgColor: 'bg-error/10',
    icon: XCircle,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-charcoal',
    bgColor: 'bg-cream',
    icon: CheckCircle,
  },
};

const tabs: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

function BookingCard({
  booking,
}: {
  booking: {
    id: string;
    weddingDate: string;
    venueName: string;
    venueCity?: string;
    clientName?: string;
    status: BookingStatus;
    totalAmount: number;
    paidAmount: number;
    payoutAmount: number;
    createdAt: string;
  };
}) {
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Link href={`/vendor/bookings/${booking.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </span>
                  <span className="text-xs text-muted">
                    Booked {formatDate(booking.createdAt)}
                  </span>
                </div>

                <h3 className="font-semibold text-charcoal mb-1">
                  {booking.venueName}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(booking.weddingDate)}
                  </span>
                  {booking.venueCity && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.venueCity}
                    </span>
                  )}
                  {booking.clientName && (
                    <span className="text-charcoal font-medium">
                      {booking.clientName}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted">Payout</p>
                  <p className="font-semibold text-charcoal">
                    {formatCurrency(booking.payoutAmount)}
                  </p>
                  {booking.paidAmount < booking.totalAmount && (
                    <p className="text-xs text-muted">
                      {formatCurrency(booking.paidAmount)} paid
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-6 w-48 mb-2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function VendorBookingsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as BookingStatus | null;
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>(
    initialStatus || 'ALL'
  );

  const {
    data,
    isLoading,
    error,
  } = useVendorBookings(
    activeTab === 'ALL' ? undefined : { status: activeTab }
  );

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-charcoal">
            Bookings
          </h2>
          <p className="text-muted mt-1">
            Manage all your wedding bookings
          </p>
        </div>
        <Link href="/vendor/calendar">
          <Button variant="secondary">View Calendar</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? 'bg-gold text-white'
                : 'bg-cream text-charcoal hover:bg-cream/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <BookingsSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              type="no-bookings"
              onAction={() => window.location.reload()}
            />
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState type="no-bookings" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </AnimatePresence>

          {/* Stats summary */}
          <Card variant="accent" className="mt-6">
            <CardContent className="py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-serif font-semibold text-charcoal">
                    {data?.total || 0}
                  </p>
                  <p className="text-sm text-muted">Total Bookings</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-semibold text-success">
                    {formatCurrency(
                      bookings.reduce((sum, b) => sum + b.payoutAmount, 0)
                    )}
                  </p>
                  <p className="text-sm text-muted">Total Payout</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-semibold text-gold">
                    {bookings.filter((b) => b.status === 'PENDING').length}
                  </p>
                  <p className="text-sm text-muted">Pending Action</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function VendorBookingsPage() {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <VendorBookingsContent />
    </Suspense>
  );
}
