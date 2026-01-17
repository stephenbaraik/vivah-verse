'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  auspiciousDates?: Date[];
  disabledDates?: Date[];
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DatePicker({
  value,
  onChange,
  minDate = new Date(),
  auspiciousDates = [],
  disabledDates = [],
  className,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isAuspicious = (date: Date) => {
    return auspiciousDates.some(
      d => d.toDateString() === date.toDateString()
    );
  };

  const isDisabled = (date: Date) => {
    if (date < minDate) return true;
    return disabledDates.some(
      d => d.toDateString() === date.toDateString()
    );
  };

  const isSelected = (date: Date) => {
    return value?.toDateString() === date.toDateString();
  };

  const isToday = (date: Date) => {
    return new Date().toDateString() === date.toDateString();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div
      className={cn(
        'bg-white/55 backdrop-blur-2xl rounded-2xl shadow-[var(--shadow-glass)] border border-white/40 p-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full bg-white/35 border border-white/30 backdrop-blur-xl hover:bg-white/55 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-charcoal" />
        </button>
        <h3 className="font-serif text-xl font-semibold text-charcoal">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full bg-white/35 border border-white/30 backdrop-blur-xl hover:bg-white/55 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-charcoal" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="wait">
          {days.map((date, idx) => (
            <motion.div
              key={`${currentMonth.getMonth()}-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {date ? (
                <button
                  onClick={() => !isDisabled(date) && onChange(date)}
                  disabled={isDisabled(date)}
                  className={cn(
                    'relative w-full aspect-square flex items-center justify-center',
                    'rounded-full text-sm transition-all duration-200',
                    isDisabled(date) && 'text-muted/50 cursor-not-allowed',
                    !isDisabled(date) && !isSelected(date) && 'hover:bg-white/45 hover:shadow-[var(--shadow-glass)]',
                    isToday(date) && !isSelected(date) && 'font-semibold text-rani',
                    isSelected(date) && 'bg-rani text-white font-semibold shadow-[var(--shadow-glow-rani)]',
                    isAuspicious(date) && !isSelected(date) && 'ring-2 ring-gold ring-offset-2 ring-offset-[rgba(255,255,255,0.35)]'
                  )}
                >
                  {date.getDate()}
                  {isAuspicious(date) && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-gold" />
                  )}
                </button>
              ) : (
                <div className="w-full aspect-square" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-divider">
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-4 h-4 rounded-full ring-2 ring-gold" />
          <span>Auspicious</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-4 h-4 rounded-full bg-rani" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
