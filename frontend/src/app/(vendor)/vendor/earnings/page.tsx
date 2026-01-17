'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { useVendorEarnings } from '@/features/vendors';
import { formatCurrency } from '@/lib/utils';
import {
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
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

function EarningsCard({
  label,
  value,
  icon: Icon,
  color = 'text-charcoal',
  bgColor = 'bg-cream',
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  bgColor?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{label}</p>
            <p className={`text-3xl font-serif font-semibold ${color}`}>
              {formatCurrency(value)}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className="w-5 h-5 text-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EarningsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-9 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="py-8">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function MonthlyChart({
  data,
}: {
  data: { month: string; amount: number }[];
}) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.month} className="flex items-center gap-4">
          <span className="w-12 text-sm text-muted font-medium">
            {item.month}
          </span>
          <div className="flex-1 h-8 bg-cream rounded-lg overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-lg"
              initial={{ width: 0 }}
              animate={{ width: `${(item.amount / maxAmount) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            />
          </div>
          <span className="w-24 text-sm font-medium text-right">
            {formatCurrency(item.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}

function PayoutStatusBadge({ status }: { status: 'COMPLETED' | 'PENDING' | 'FAILED' }) {
  const config = {
    COMPLETED: {
      label: 'Completed',
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: CheckCircle,
    },
    PENDING: {
      label: 'Pending',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      icon: Clock,
    },
    FAILED: {
      label: 'Failed',
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: XCircle,
    },
  };

  const c = config[status];
  const StatusIcon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.color} ${c.bgColor}`}
    >
      <StatusIcon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

export default function VendorEarningsPage() {
  const { data: earnings, isLoading, error } = useVendorEarnings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <EarningsSkeleton />
      </div>
    );
  }

  if (error || !earnings) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold text-charcoal">
          Earnings
        </h2>
        <Card>
          <CardContent className="py-8">
            <EmptyState
              type="no-payments"
              onAction={() => window.location.reload()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

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
          Earnings
        </h2>
        <p className="text-muted mt-1">Track your revenue and payouts</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <EarningsCard
          label="Total Earnings"
          value={earnings.total}
          icon={IndianRupee}
          color="text-charcoal"
        />
        <EarningsCard
          label="Paid Out"
          value={earnings.paid}
          icon={CheckCircle}
          color="text-success"
          bgColor="bg-success/10"
        />
        <EarningsCard
          label="Pending Payout"
          value={earnings.pending}
          icon={Clock}
          color="text-gold"
          bgColor="bg-gold/10"
        />
      </motion.div>

      {/* Monthly Breakdown */}
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Monthly Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnings.monthlyBreakdown.length === 0 ? (
              <EmptyState type="no-payments" />
            ) : (
              <MonthlyChart data={earnings.monthlyBreakdown} />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Payouts */}
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            {earnings.recentPayouts.length === 0 ? (
              <EmptyState type="no-payments" />
            ) : (
              <div className="space-y-3">
                {earnings.recentPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between py-3 border-b border-cream last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">
                          {formatCurrency(payout.amount)}
                        </p>
                        <p className="text-sm text-muted">
                          {new Date(payout.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <PayoutStatusBadge status={payout.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payout Info */}
      <motion.div variants={fadeIn}>
        <Card variant="accent">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <IndianRupee className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-charcoal">Payout Schedule</h4>
                <p className="text-sm text-muted mt-1">
                  Payouts are processed within 7 business days after a booking is
                  completed. Platform fee of 10% is deducted from each transaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
