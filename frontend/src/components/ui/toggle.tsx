'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          checked ? 'bg-rani' : 'bg-divider'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm',
            checked ? 'ml-6' : 'ml-1'
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-charcoal">{label}</span>
          )}
          {description && (
            <p className="text-sm text-muted">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}

/**
 * Service Toggle for package builder
 */
interface ServiceToggleProps {
  name: string;
  description?: string;
  price: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function ServiceToggle({
  name,
  description,
  price,
  checked,
  onChange,
  className,
}: ServiceToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border transition-colors',
        checked ? 'border-rani bg-rose-soft' : 'border-divider bg-white',
        className
      )}
    >
      <div className="flex-1">
        <p className="font-medium text-charcoal">{name}</p>
        {description && (
          <p className="text-sm text-muted mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gold">
          ₹{price.toLocaleString()}
        </span>
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}
