'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'default' && 'border-b border-divider',
        variant === 'pills' && 'gap-2 bg-rose-soft p-1 rounded-lg',
        className
      )}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              variant === 'default' && [
                'border-b-2 -mb-px',
                isActive
                  ? 'border-rani text-rani'
                  : 'border-transparent text-muted hover:text-charcoal',
              ],
              variant === 'pills' && [
                'rounded-md',
                isActive
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-muted hover:text-charcoal',
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-rani text-white rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Stepper component for multi-step forms
 */
interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  'transition-colors duration-200',
                  isCompleted && 'bg-success text-white',
                  isCurrent && 'bg-rani text-white',
                  !isCompleted && !isCurrent && 'bg-divider text-muted'
                )}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isCurrent ? 'text-rani' : 'text-muted'
                )}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 md:w-24 h-0.5 mx-2',
                  isCompleted ? 'bg-success' : 'bg-divider'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
