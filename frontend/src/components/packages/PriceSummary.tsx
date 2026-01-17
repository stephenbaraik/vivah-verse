'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, ShoppingBag } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { usePackageStore, calculatePackageTotal } from '@/stores/package-store';
import type { PackageCategory } from '@/types/package';

interface PriceSummaryProps {
  onContinue?: () => void;
  continueLabel?: string;
  className?: string;
}

const CATEGORY_LABELS: Record<PackageCategory, string> = {
  venue: 'Venue',
  decor: 'Decor',
  catering: 'Catering',
  photography: 'Photography',
  videography: 'Videography',
  dj: 'DJ & Sound',
  mehendi: 'Mehendi',
  makeup: 'Bridal Makeup',
};

/**
 * Sticky price summary sidebar
 * Always visible, transparent totals, trust signal
 */
export function PriceSummary({
  onContinue,
  continueLabel = 'Continue',
  className,
}: PriceSummaryProps) {
  const { selection, guestCount, budget, removeItem } = usePackageStore();

  const total = useMemo(
    () => calculatePackageTotal(selection, guestCount),
    [selection, guestCount]
  );

  const isOverBudget = total > budget;
  const itemCount = Object.values(selection).filter(Boolean).length;

  // Calculate venue total separately (per-plate)
  const venueTotal = selection.venue ? selection.venue.price * guestCount : 0;

  return (
    <div className={`sticky top-24 ${className}`}>
      <Card className={isOverBudget ? 'ring-2 ring-warning' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Budget Warning */}
          <AnimatePresence>
            {isOverBudget && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2"
              >
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Over budget</p>
                  <p className="text-xs text-muted">
                    {formatCurrency(total - budget)} above your limit
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {itemCount === 0 && (
            <div className="text-center py-6 text-muted">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items selected yet</p>
            </div>
          )}

          {/* Line items */}
          <div className="space-y-2 mb-4">
            <AnimatePresence mode="popLayout">
              {Object.entries(selection).map(([key, item]) => {
                if (!item) return null;
                const category = key as PackageCategory;
                const isVenue = category === 'venue';
                const displayPrice = isVenue ? venueTotal : item.price;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    className="flex items-center justify-between text-sm group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-charcoal truncate block">
                        {item.name}
                      </span>
                      {isVenue && (
                        <span className="text-xs text-muted">
                          {guestCount} guests × {formatCurrency(item.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal font-medium">
                        {formatCurrency(displayPrice)}
                      </span>
                      <button
                        onClick={() => removeItem(category)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                        title={`Remove ${CATEGORY_LABELS[category]}`}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Total */}
          {itemCount > 0 && (
            <>
              <div className="border-t border-divider pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span
                    className={`font-serif text-xl font-semibold ${
                      isOverBudget ? 'text-warning' : 'text-charcoal'
                    }`}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">
                  Budget: {formatCurrency(budget)}
                </p>
              </div>

              {/* CTA */}
              {onContinue && (
                <Button
                  fullWidth
                  className="mt-4"
                  onClick={onContinue}
                >
                  {continueLabel}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
