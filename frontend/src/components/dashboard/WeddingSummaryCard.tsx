'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Edit2 } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Wedding } from '@/types/api';

interface WeddingSummaryCardProps {
  wedding: Wedding;
  daysUntilWedding?: number;
  className?: string;
  onEdit?: () => void;
}

/**
 * Wedding summary hero card at top of dashboard
 */
export function WeddingSummaryCard({
  wedding,
  daysUntilWedding,
  className,
  onEdit,
}: WeddingSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="accent">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-rani/30 to-gold/30 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">💒</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl font-semibold text-charcoal truncate">
                Your Wedding
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted">
                {wedding.weddingDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(wedding.weddingDate)}
                  </span>
                )}
                {wedding.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {wedding.location}
                  </span>
                )}
                {wedding.guestCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {wedding.guestCount} guests
                  </span>
                )}
              </div>
            </div>

            {/* Budget / Countdown */}
            <div className="text-right flex-shrink-0">
              {daysUntilWedding !== undefined && daysUntilWedding > 0 && (
                <div className="mb-2">
                  <p className="text-3xl font-serif font-semibold text-rani">
                    {daysUntilWedding}
                  </p>
                  <p className="text-sm text-muted">days to go</p>
                </div>
              )}
              {wedding.budget && (
                <div>
                  <p className="text-sm text-muted">Budget</p>
                  <p className="text-lg font-semibold text-charcoal">
                    {formatCurrency(wedding.budget)}
                  </p>
                </div>
              )}
              {onEdit && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onEdit}
                  className="mt-2"
                  leftIcon={<Edit2 className="w-3 h-3" />}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
