'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboarding-store';

const STEPS = [
  { number: 1, label: 'Date' },
  { number: 2, label: 'Couple' },
  { number: 3, label: 'Preferences' },
  { number: 4, label: 'Review' },
];

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export default function OnboardingLayout({ children, currentStep }: OnboardingLayoutProps) {
  const { completedSteps } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Progress Bar */}
      <div className="bg-white/55 backdrop-blur-2xl border-b border-white/35 sticky top-0 z-40 shadow-[var(--shadow-glass)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(step.number);
              const isCurrent = step.number === currentStep;
              const isPast = step.number < currentStep;
              
              return (
                <div key={step.number} className="flex items-center">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isCompleted || isCurrent ? '#C45B84' : '#fff',
                        borderColor: isCompleted || isCurrent ? '#C45B84' : '#E5E5E5',
                      }}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        border-2 transition-colors
                        ${isCompleted || isCurrent ? 'text-white' : 'text-muted'}
                      `}
                    >
                      {isCompleted && !isCurrent ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.number}</span>
                      )}
                    </motion.div>
                    <span className={`
                      text-xs mt-1 hidden sm:block
                      ${isCurrent ? 'text-rani font-medium' : 'text-muted'}
                    `}>
                      {step.label}
                    </span>
                  </div>
                  
                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 mx-2 sm:mx-4">
                      <div className="h-0.5 bg-divider relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isPast || isCompleted ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-rani"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {children}
      </div>
    </div>
  );
}
