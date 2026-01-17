'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { AdminService } from '@/services/admin.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  Heart,
  IndianRupee,
  MapPin,
  ShieldCheck,
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
            <Icon className="w-5 h-5 text-rani" />
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

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => AdminService.getDashboard(),
    staleTime: 30 * 1000, // Refresh every 30s
    refetchOnWindowFocus: true,
  });

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

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold text-charcoal">
          Admin Overview
        </h2>
        <Card>
          <CardContent className="py-8">
            <EmptyState
              type="no-pending"
              onAction={() => window.location.reload()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, recentActivity } = data;

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
          Admin Overview
        </h2>
        <p className="text-muted mt-1">
          Marketplace health at a glance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Pending Approvals"
          value={stats.pendingVendors}
          icon={ShieldCheck}
          color={stats.pendingVendors > 0 ? 'text-warning' : 'text-charcoal'}
          href="/admin/vendors/approval"
        />
        <StatCard
          label="Active Weddings"
          value={stats.activeWeddings}
          icon={Heart}
          href="/admin/weddings"
        />
        <StatCard
          label="Active Venues"
          value={stats.activeVenues}
          icon={MapPin}
        />
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={IndianRupee}
          color="text-success"
        />
      </motion.div>

      {/* Pending Approvals Alert */}
      {stats.pendingVendors > 0 && (
        <motion.div variants={fadeIn}>
          <Card className="border-l-4 border-l-warning bg-warning/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-warning/10 rounded-full">
                    <ShieldCheck className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">
                      {stats.pendingVendors} vendor{stats.pendingVendors > 1 ? 's' : ''} awaiting approval
                    </p>
                    <p className="text-sm text-muted">
                      Review and approve to activate their listings
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/vendors/approval"
                  className="text-warning hover:text-warning/80 flex items-center gap-1 font-medium"
                >
                  Review now
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
                        activity.type === 'vendor_signup'
                          ? 'bg-gold'
                          : activity.type === 'booking'
                            ? 'bg-success'
                            : activity.type === 'payment'
                              ? 'bg-rani'
                              : 'bg-warning'
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

      {/* Quick Links */}
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/vendors/approval"
                className="flex items-center gap-3 p-4 rounded-lg bg-cream hover:bg-cream/80 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 text-rani" />
                <span className="font-medium">Review Approvals</span>
              </Link>
              <Link
                href="/admin/weddings"
                className="flex items-center gap-3 p-4 rounded-lg bg-cream hover:bg-cream/80 transition-colors"
              >
                <Heart className="w-5 h-5 text-rani" />
                <span className="font-medium">View Weddings</span>
              </Link>
              <Link
                href="/admin/issues"
                className="flex items-center gap-3 p-4 rounded-lg bg-cream hover:bg-cream/80 transition-colors"
              >
                <Users className="w-5 h-5 text-rani" />
                <span className="font-medium">Check Issues</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
