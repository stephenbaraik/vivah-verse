'use client';

import { motion } from 'framer-motion';
import { Sparkles, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircularConfidence } from '@/components/ui/confidence-meter';

export type Recommendation = {
  id: string;
  type: 'venue' | 'vendor' | 'date' | 'budget' | 'package';
  title: string;
  description: string;
  confidence: number;
  editable?: boolean;
  value?: string;
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply?: () => void;
  onEdit?: (newValue: string) => void;
  onDismiss?: () => void;
}

export function RecommendationCard({
  recommendation,
  onApply,
  onEdit,
  onDismiss,
}: RecommendationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(recommendation.value || '');

  const handleSaveEdit = () => {
    onEdit?.(editValue);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/50 backdrop-blur-2xl rounded-2xl shadow-[var(--shadow-glass)] p-4 border border-white/40"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-champagne flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div>
            <span className="text-xs text-gold font-medium uppercase tracking-wide">
              AI {recommendation.type}
            </span>
            <h4 className="font-medium text-charcoal">{recommendation.title}</h4>
          </div>
        </div>
        <CircularConfidence value={recommendation.confidence} size={40} />
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-2 border border-white/35 bg-white/35 backdrop-blur-xl rounded-xl text-sm resize-none focus:ring-2 focus:ring-gold focus:border-transparent"
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted mb-4">{recommendation.description}</p>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {onApply && (
              <Button size="sm" variant="ai" onClick={onApply}>
                Apply
              </Button>
            )}
            {recommendation.editable && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

/**
 * Sticky action bar for applying all recommendations
 */
interface StickyActionBarProps {
  count: number;
  onApplyAll: () => void;
  onDismissAll: () => void;
}

export function StickyActionBar({ count, onApplyAll, onDismissAll }: StickyActionBarProps) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/55 backdrop-blur-2xl border-t border-white/35 shadow-[var(--shadow-glass-hover)] p-4 z-40"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <p className="text-sm text-charcoal">
          <span className="font-semibold">{count}</span> recommendations ready
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onDismissAll}>
            Dismiss all
          </Button>
          <Button variant="ai" onClick={onApplyAll}>
            Apply all recommendations
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
