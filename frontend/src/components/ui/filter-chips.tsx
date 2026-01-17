'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  activeFilters: string[];
  onChange: (filterId: string) => void;
  onClear?: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  activeFilters,
  onChange,
  onClear,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {filters.map(filter => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium',
              'transition-all duration-200',
              'border',
              isActive
                ? 'bg-rani text-white border-rani'
                : 'bg-white text-charcoal border-divider hover:border-gold/50'
            )}
          >
            {filter.label}
          </button>
        );
      })}
      {activeFilters.length > 0 && onClear && (
        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded-full text-sm font-medium text-muted hover:text-error transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear all
        </button>
      )}
    </div>
  );
}

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

export function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-soft text-rani rounded-md text-sm">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-rani/10 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
