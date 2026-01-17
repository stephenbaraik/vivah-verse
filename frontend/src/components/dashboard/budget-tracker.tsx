'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

interface BudgetTrackerProps {
  totalBudget?: number;
  categories?: BudgetCategory[];
  onEditBudget?: () => void;
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: 'venue', name: 'Venue', allocated: 500000, spent: 350000, icon: '🏛️', color: '#C94A6A' },
  { id: 'catering', name: 'Catering', allocated: 300000, spent: 150000, icon: '🍛', color: '#C9A24D' },
  { id: 'decor', name: 'Decor', allocated: 200000, spent: 100000, icon: '🌸', color: '#E8A0B0' },
  { id: 'photography', name: 'Photography', allocated: 150000, spent: 75000, icon: '📸', color: '#6B7280' },
  { id: 'entertainment', name: 'Entertainment', allocated: 100000, spent: 25000, icon: '🎵', color: '#8B5CF6' },
  { id: 'attire', name: 'Attire & Jewelry', allocated: 250000, spent: 180000, icon: '👗', color: '#EC4899' },
  { id: 'misc', name: 'Miscellaneous', allocated: 100000, spent: 20000, icon: '📦', color: '#10B981' },
];

export function BudgetTracker({
  totalBudget = 1600000,
  categories = DEFAULT_CATEGORIES,
  onEditBudget,
}: BudgetTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totals = useMemo(() => {
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = totalBudget - totalSpent;
    const percentUsed = (totalSpent / totalBudget) * 100;
    const unallocated = totalBudget - totalAllocated;

    return { totalAllocated, totalSpent, remaining, percentUsed, unallocated };
  }, [categories, totalBudget]);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 100) return 'text-error';
    if (percent >= 80) return 'text-amber-500';
    return 'text-success';
  };

  const getStatusIcon = (percent: number) => {
    if (percent >= 100) return <AlertTriangle className="w-4 h-4" />;
    if (percent >= 80) return <TrendingUp className="w-4 h-4" />;
    return <CheckCircle2 className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-divider overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-rani" />
              Wedding Budget
            </h3>
            <p className="text-sm text-muted mt-1">Track your expenses</p>
          </div>
          {onEditBudget && (
            <Button variant="secondary" size="sm" onClick={onEditBudget}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-rose-soft rounded-xl">
            <p className="text-xs text-muted mb-1">Total Budget</p>
            <p className="text-lg font-bold text-charcoal">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <p className="text-xs text-muted mb-1">Spent</p>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(totals.totalSpent)}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-xs text-muted mb-1">Remaining</p>
            <p className="text-lg font-bold text-success">{formatCurrency(totals.remaining)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(totals.percentUsed, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                totals.percentUsed >= 100
                  ? 'bg-gradient-to-r from-error to-red-400'
                  : totals.percentUsed >= 80
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-rani to-[#E8A0B0]'
              )}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span>{totals.percentUsed.toFixed(1)}% used</span>
            <span className={getStatusColor(totals.percentUsed)}>
              {totals.percentUsed >= 100
                ? 'Over budget!'
                : totals.percentUsed >= 80
                ? 'Approaching limit'
                : 'On track'}
            </span>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 hover:bg-rose-soft/50 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium text-charcoal flex items-center gap-2">
            <PieChart className="w-4 h-4 text-muted" />
            Category Breakdown
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-3">
                {categories.map((category) => {
                  const percentSpent = (category.spent / category.allocated) * 100;
                  return (
                    <div key={category.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium text-charcoal">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <span className={getStatusColor(percentSpent)}>
                            {getStatusIcon(percentSpent)}
                          </span>
                          <span className="text-charcoal">
                            {formatCurrency(category.spent)}{' '}
                            <span className="text-muted">/ {formatCurrency(category.allocated)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentSpent, 100)}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                  );
                })}

                {totals.unallocated > 0 && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600">
                      <span className="text-lg">💰</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(totals.unallocated)} unallocated
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default BudgetTracker;
