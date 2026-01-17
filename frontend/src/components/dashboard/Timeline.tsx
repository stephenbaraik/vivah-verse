'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface TimelineStep {
  label: string;
  done: boolean;
  date?: string;
}

interface TimelineProps {
  steps?: TimelineStep[];
  className?: string;
}

const DEFAULT_STEPS: TimelineStep[] = [
  { label: 'Wedding created', done: true },
  { label: 'Venue booked', done: false },
  { label: 'Decor finalized', done: false },
  { label: 'Catering confirmed', done: false },
  { label: 'Wedding day', done: false },
];

/**
 * Timeline component showing wedding planning progress
 * Calm, glanceable, future-dynamic
 */
export function Timeline({ steps = DEFAULT_STEPS, className }: TimelineProps) {
  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-medium text-charcoal">Timeline</h2>
        <span className="text-sm text-muted">
          {completedCount}/{steps.length} completed
        </span>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-divider" />
        <div
          className="absolute left-[11px] top-3 w-0.5 bg-success transition-all duration-500"
          style={{
            height: `${(completedCount / steps.length) * 100}%`,
          }}
        />

        <ol className="space-y-4 relative">
          {steps.map((step, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  step.done
                    ? 'bg-success text-white'
                    : 'bg-white border-2 border-divider text-muted'
                }`}
              >
                {step.done ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              <div className="flex-1">
                <span
                  className={
                    step.done
                      ? 'font-medium text-charcoal'
                      : 'text-muted'
                  }
                >
                  {step.label}
                </span>
                {step.date && (
                  <span className="text-xs text-muted ml-2">{step.date}</span>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
