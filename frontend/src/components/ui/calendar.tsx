'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';

interface CalendarDay {
  date: Date;
  status: 'available' | 'blocked' | 'booked';
  bookingInfo?: string;
}

interface CalendarProps {
  days: CalendarDay[];
  onDayClick?: (date: Date) => void;
  onBlockDate?: (date: Date) => void;
  onUnblockDate?: (date: Date) => void;
  editable?: boolean;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar({
  days,
  onDayClick,
  onBlockDate,
  onUnblockDate,
  editable = false,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const result: (CalendarDay | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      result.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayData = days.find(d => d.date.toDateString() === date.toDateString());
      result.push(dayData || { date, status: 'available' });
    }
    
    return result;
  };

  const monthDays = getDaysInMonth();

  const getStatusColor = (status: CalendarDay['status']) => {
    switch (status) {
      case 'available':
        return 'bg-success/20 text-success hover:bg-success/30';
      case 'blocked':
        return 'bg-muted/20 text-muted';
      case 'booked':
        return 'bg-rani/20 text-rani';
    }
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-divider">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 rounded-full hover:bg-rose-soft transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-charcoal" />
        </button>
        <h3 className="font-serif text-lg font-semibold text-charcoal">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 rounded-full hover:bg-rose-soft transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-charcoal" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day, idx) => (
            <div key={idx} className="aspect-square">
              {day ? (
                <button
                  onClick={() => {
                    setSelectedDay(day);
                    onDayClick?.(day.date);
                  }}
                  className={cn(
                    'w-full h-full rounded-lg text-sm font-medium transition-colors',
                    getStatusColor(day.status),
                    editable && day.status !== 'booked' && 'cursor-pointer'
                  )}
                >
                  {day.date.getDate()}
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-4 border-t border-divider">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded bg-success/20" />
          <span className="text-muted">Available</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded bg-muted/20" />
          <span className="text-muted">Blocked</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded bg-rani/20" />
          <span className="text-muted">Booked</span>
        </div>
      </div>

      {/* Day detail drawer */}
      {selectedDay && editable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-divider bg-rose-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-charcoal">
                {selectedDay.date.toLocaleDateString('en-IN', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
              <StatusBadge status={selectedDay.status} size="sm" className="mt-1" />
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="p-1 hover:bg-white rounded"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>
          
          {selectedDay.status === 'booked' ? (
            <p className="text-sm text-muted">
              {selectedDay.bookingInfo || 'This date is booked'}
            </p>
          ) : (
            <div className="flex gap-2">
              {selectedDay.status === 'available' ? (
                <button
                  onClick={() => onBlockDate?.(selectedDay.date)}
                  className="flex-1 py-2 bg-muted/20 text-charcoal rounded-lg text-sm font-medium hover:bg-muted/30 transition-colors"
                >
                  Block this date
                </button>
              ) : (
                <button
                  onClick={() => onUnblockDate?.(selectedDay.date)}
                  className="flex-1 py-2 bg-success/20 text-success rounded-lg text-sm font-medium hover:bg-success/30 transition-colors"
                >
                  Unblock this date
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
