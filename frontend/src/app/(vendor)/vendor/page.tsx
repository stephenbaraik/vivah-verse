'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { useVendorDashboard, useVendorProfile } from '@/features/vendors';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar,
  IndianRupee,
  ClipboardList,
  Clock,
  Star,
  ArrowRight,
} from 'lucide-react';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StatCard({
  label,
  value,
  icon: Icon,
  color = 'text-charcoal',
  href,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  href?: string;
}) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{label}</p>
            <p className={`text-3xl font-serif font-semibold ${color}`}>
              {value}
            </p>
          </div>
          <div className="p-2 bg-cream rounded-lg">
            <Icon className="w-5 h-5 text-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-9 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function VendorDashboardPage() {
  const { data: profile } = useVendorProfile();
  const { data: dashboard, isLoading, error } = useVendorDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <StatsSkeleton />
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold text-charcoal">
          Dashboard
        </h2>
        <Card>
          <CardContent className="py-8">
            <EmptyState
              type="no-bookings"
              onAction={() => window.location.reload()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, nextBooking, recentActivity } = dashboard;

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeIn}>
        <h2 className="text-2xl font-serif font-semibold text-charcoal">
          Welcome back{profile?.businessName ? `, ${profile.businessName}` : ''}
        </h2>
        <p className="text-muted mt-1">
          Here&apos;s what&apos;s happening with your business
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings}
          icon={ClipboardList}
          href="/vendor/bookings"
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingBookings}
          icon={Clock}
          color={stats.pendingBookings > 0 ? 'text-gold' : 'text-charcoal'}
          href="/vendor/bookings?status=PENDING"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={IndianRupee}
          color="text-success"
          href="/vendor/earnings"
        />
        <StatCard
          label="Rating"
          value={
            stats.reviewCount > 0
              ? `${stats.rating.toFixed(1)} ★`
              : 'No reviews'
          }
          icon={Star}
          color="text-gold"
        />
      </motion.div>

      {/* Next Booking */}
      {nextBooking && (
        <motion.div variants={fadeIn}>
          <Card variant="accent" className="border-l-4 border-l-gold">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gold/10 rounded-full">
                    <Calendar className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Next Booking</p>
                    <p className="font-medium text-charcoal">
                      {nextBooking.venueName}
                    </p>
                    <p className="text-sm text-muted">
                      {formatDate(nextBooking.weddingDate)}
                      {nextBooking.clientName && ` • ${nextBooking.clientName}`}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/vendor/bookings/${nextBooking.id}`}
                  className="text-gold hover:text-gold-dark flex items-center gap-1"
                >
                  View details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <EmptyState type="all-caught-up" />
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 py-2 border-b border-cream last:border-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'booking'
                          ? 'bg-gold'
                          : activity.type === 'payment'
                            ? 'bg-success'
                            : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-charcoal">{activity.message}</p>
                      <p className="text-xs text-muted mt-1">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/vendor/calendar"
                className="flex items-center gap-3 p-4 rounded-lg bg-cream hover:bg-cream/80 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gold" />
                <span className="font-medium">Manage Availability</span>
              </Link>
              <Link
                href="/vendor/listings"
                className="flex items-center gap-3 p-4 rounded-lg bg-cream hover:bg-cream/80 transition-colors"
              >
                <ClipboardList className="w-5 h-5 text-gold" />
                <span className="font-medium">Edit Listings</span>
              </Link>
              <Link
                href="/vendor/earnings"
                className="flex items-center gap-3 p-4 rounded-lg bg-cream hover:bg-cream/80 transition-colors"
              >
                <IndianRupee className="w-5 h-5 text-gold" />
                <span className="font-medium">View Earnings</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
