'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface BookingProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

export function BookingProgress({
  steps,
  currentStep,
  className,
  variant = 'horizontal',
}: BookingProgressProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index < currentStep
                  ? 'bg-success'
                  : index === currentStep
                  ? 'bg-rani'
                  : 'bg-gray-300'
              )}
            />
            {index < steps.length - 1 && (
              <div className="w-4 h-px bg-gray-200" />
            )}
          </div>
        ))}
        <span className="text-xs text-muted ml-2">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-1', className)}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-3">
                {/* Step indicator */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? 'var(--color-success)'
                        : isCurrent
                        ? 'var(--color-brand-rani)'
                        : 'var(--color-neutral-divider)',
                    }}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center z-10',
                      (isCompleted || isCurrent) ? 'text-white' : 'text-muted'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.div>
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-0.5 h-8 mt-1',
                        isCompleted ? 'bg-success' : 'bg-divider'
                      )}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="pt-1 pb-6">
                  <p
                    className={cn(
                      'font-medium',
                      isCurrent ? 'text-charcoal' : isCompleted ? 'text-success' : 'text-muted'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-sm text-muted mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className="flex-1 flex items-center"
            >
              <div className="flex flex-col items-center flex-1">
                {/* Step indicator */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-rani text-white ring-4 ring-rani/20'
                      : 'bg-gray-100 text-muted'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                {/* Step label */}
                <p
                  className={cn(
                    'text-sm text-center font-medium',
                    isCurrent ? 'text-charcoal' : isCompleted ? 'text-success' : 'text-muted'
                  )}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 px-4 -mt-6">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-success rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mini version for header/sticky bar
export function BookingProgressMini({
  steps,
  currentStep,
  className,
}: BookingProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-rani to-gold rounded-full"
        />
      </div>
      <span className="text-sm font-medium text-charcoal whitespace-nowrap">
        {currentStep + 1}/{steps.length}
      </span>
    </div>
  );
}

export default BookingProgress;
