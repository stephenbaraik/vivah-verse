'use client';

import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING';

interface PaymentData {
  totalAmount: number;
  paidAmount: number;
  status: PaymentStatus;
}

interface PaymentSummaryProps {
  payments: PaymentData;
  onPayNow?: () => void;
  className?: string;
}

const STATUS_CONFIG = {
  PAID: {
    label: 'Fully Paid',
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  PARTIAL: {
    label: 'Partial Payment',
    icon: Clock,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  PENDING: {
    label: 'Payment Pending',
    icon: AlertCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
};

/**
 * Payment summary card - critical trust signal
 * Shows transparency, reduces anxiety
 */
export function PaymentSummary({
  payments,
  onPayNow,
  className,
}: PaymentSummaryProps) {
  const config = STATUS_CONFIG[payments.status];
  const StatusIcon = config.icon;
  const remainingAmount = payments.totalAmount - payments.paidAmount;
  const progressPercent = (payments.paidAmount / payments.totalAmount) * 100;

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-medium text-charcoal flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted" />
            Payments
          </h2>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-3 bg-divider rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-success rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-success font-medium">
              {formatCurrency(payments.paidAmount)} paid
            </span>
            {remainingAmount > 0 && (
              <span className="text-muted">
                {formatCurrency(remainingAmount)} remaining
              </span>
            )}
          </div>
        </div>

        {/* Amount breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-divider">
            <span className="text-muted">Total Amount</span>
            <span className="font-semibold text-charcoal">
              {formatCurrency(payments.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-divider">
            <span className="text-muted">Amount Paid</span>
            <span className="font-semibold text-success">
              {formatCurrency(payments.paidAmount)}
            </span>
          </div>
          {remainingAmount > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-muted">Balance Due</span>
              <span className="font-semibold text-charcoal">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        {payments.status !== 'PAID' && onPayNow && (
          <Button onClick={onPayNow} className="w-full">
            Pay {formatCurrency(remainingAmount)}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
