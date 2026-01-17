'use client';

import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AIConfidence = 'high' | 'medium' | 'low';

interface AIBadgeProps {
  confidence: AIConfidence;
  label?: string;
  showMeter?: boolean;
  className?: string;
}

const confidenceConfig = {
  high: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    label: 'AI Confident',
    percent: 90,
  },
  medium: {
    icon: Sparkles,
    color: 'text-gold',
    bg: 'bg-gold/10',
    label: 'AI Suggested',
    percent: 70,
  },
  low: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    label: 'Review Recommended',
    percent: 40,
  },
};

export function AIBadge({ 
  confidence, 
  label,
  showMeter = false,
  className 
}: AIBadgeProps) {
  const config = confidenceConfig[confidence];
  const Icon = config.icon;

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <div 
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
          config.bg,
          config.color
        )}
      >
        <Icon className="w-3 h-3" />
        <span>{label || config.label}</span>
      </div>
      
      {showMeter && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-divider rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${config.percent}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                'h-full rounded-full',
                confidence === 'high' && 'bg-success',
                confidence === 'medium' && 'bg-gold',
                confidence === 'low' && 'bg-warning'
              )}
            />
          </div>
          <span className="text-xs text-muted">{config.percent}%</span>
        </div>
      )}
    </div>
  );
}

/**
 * AI Explainability Panel
 */
interface AIExplainerProps {
  title: string;
  reasons: string[];
  editable?: boolean;
  onEdit?: () => void;
}

export function AIExplainer({ title, reasons, editable, onEdit }: AIExplainerProps) {
  return (
    <div className="bg-champagne/30 border border-gold/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="font-medium text-sm text-charcoal">{title}</span>
        </div>
        {editable && (
          <button
            onClick={onEdit}
            className="text-xs text-gold hover:text-gold/80 transition-colors"
          >
            Edit preferences
          </button>
        )}
      </div>
      <ul className="space-y-1">
        {reasons.map((reason, idx) => (
          <li key={idx} className="text-sm text-muted flex items-start gap-2">
            <span className="text-gold">•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted italic">
        This is an AI suggestion. Please review and adjust based on your preferences.
      </p>
    </div>
  );
}
