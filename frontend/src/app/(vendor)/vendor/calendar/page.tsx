'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Skeleton
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useVendorCalendar, useUpdateAvailability } from '@/features/vendors';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function VendorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Format month for API
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Fetch calendar data
  const { data: calendarDays, isLoading } = useVendorCalendar(monthKey);
  const updateAvailability = useUpdateAvailability();

  // Build date status map
  const dateStatusMap = useMemo(() => {
    const map = new Map<string, 'AVAILABLE' | 'BOOKED' | 'BLOCKED'>();
    if (calendarDays) {
      calendarDays.forEach((day) => {
        map.set(day.date, day.status);
      });
    }
    return map;
  }, [calendarDays]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newMonth = direction === 'next' ? prev.getMonth() + 1 : prev.getMonth() - 1;
      return new Date(prev.getFullYear(), newMonth, 1);
    });
  };

  const formatDateKey = useCallback((day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }, [month, year]);

  const handleDateClick = (day: number) => {
    const dateKey = formatDateKey(day);
    const status = dateStatusMap.get(dateKey) || 'AVAILABLE';
    if (status === 'BOOKED') return; // Can't modify booked dates
    setSelectedDate(dateKey);
    setShowDrawer(true);
  };

  const toggleBlock = () => {
    if (!selectedDate) return;
    const currentStatus = dateStatusMap.get(selectedDate) || 'AVAILABLE';
    const newStatus = currentStatus === 'BLOCKED' ? 'AVAILABLE' : 'BLOCKED';
    
    updateAvailability.mutate(
      { date: selectedDate, status: newStatus },
      { onSuccess: () => setShowDrawer(false) }
    );
  };

  const getDateStatus = useCallback((day: number) => {
    const dateKey = formatDateKey(day);
    return dateStatusMap.get(dateKey) || 'AVAILABLE';
  }, [formatDateKey, dateStatusMap]);

  // Calculate stats
  const stats = useMemo(() => {
    let available = 0;
    let blocked = 0;
    let booked = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDateStatus(day);
      if (status === 'AVAILABLE') available++;
      else if (status === 'BLOCKED') blocked++;
      else if (status === 'BOOKED') booked++;
    }
    
    return { available, blocked, booked };
  }, [daysInMonth, getDateStatus]);

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-20" />);
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDateStatus(day);
      const dateKey = formatDateKey(day);
      const isToday = dateKey === new Date().toISOString().split('T')[0];
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: status !== 'BOOKED' ? 1.05 : 1 }}
          whileTap={{ scale: status !== 'BOOKED' ? 0.95 : 1 }}
          onClick={() => handleDateClick(day)}
          disabled={status === 'BOOKED'}
          className={cn(
            'h-12 md:h-20 rounded-lg flex flex-col items-center justify-center transition-colors relative',
            status === 'AVAILABLE' && 'bg-success/10 text-success hover:bg-success/20',
            status === 'BLOCKED' && 'bg-divider text-muted hover:bg-cloud',
            status === 'BOOKED' && 'bg-rani/20 text-rani cursor-not-allowed',
            isToday && 'ring-2 ring-gold'
          )}
        >
          <span className={cn(
            'text-lg font-medium',
            status === 'BOOKED' && 'line-through'
          )}>
            {day}
          </span>
          <span className="text-xs hidden md:block">
            {status === 'AVAILABLE' && 'Open'}
            {status === 'BLOCKED' && 'Blocked'}
            {status === 'BOOKED' && 'Booked'}
          </span>
        </motion.button>
      );
    }
    
    return days;
  };

  const selectedStatus = selectedDate ? (dateStatusMap.get(selectedDate) || 'AVAILABLE') : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Availability Calendar
          </h1>
          <p className="text-muted">Manage your venue availability</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/20" />
          <span className="text-sm text-muted">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-divider" />
          <span className="text-sm text-muted">Blocked by you</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rani/20" />
          <span className="text-sm text-muted">Booked</span>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Prev
            </Button>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-rani" />
              {MONTHS[month]} {year}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted py-2"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-12 md:h-20 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-serif font-semibold text-success">
              {stats.available}
            </p>
            <p className="text-sm text-muted">Days available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-serif font-semibold text-muted">
              {stats.blocked}
            </p>
            <p className="text-sm text-muted">Days blocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-serif font-semibold text-rani">
              {stats.booked}
            </p>
            <p className="text-sm text-muted">Days booked</p>
          </CardContent>
        </Card>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {showDrawer && selectedDate && selectedStatus && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/60 backdrop-blur-2xl border-l border-white/35 shadow-[var(--shadow-glass-hover)] z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-charcoal">
                  {new Date(selectedDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 rounded-full bg-white/35 border border-white/30 backdrop-blur-xl hover:bg-white/55 transition-all"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="space-y-4">
                <div className={cn(
                  'p-4 rounded-xl flex items-center justify-between border border-white/35 bg-white/40 backdrop-blur-xl',
                  selectedStatus === 'BLOCKED' ? 'shadow-[var(--shadow-glass)]' : 'shadow-[var(--shadow-glass)]'
                )}>
                  <div>
                    <p className="font-medium text-charcoal">
                      {selectedStatus === 'BLOCKED' ? 'Currently Blocked' : 'Currently Available'}
                    </p>
                    <p className="text-sm text-muted">
                      {selectedStatus === 'BLOCKED'
                        ? 'Customers cannot book this date'
                        : 'Open for bookings'}
                    </p>
                  </div>
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    selectedStatus === 'BLOCKED' ? 'bg-white/50 border border-white/35' : 'bg-success text-white'
                  )}>
                    {selectedStatus === 'BLOCKED' ? (
                      <X className="w-5 h-5 text-muted" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <Button
                  fullWidth
                  variant={selectedStatus === 'BLOCKED' ? 'primary' : 'secondary'}
                  onClick={toggleBlock}
                  disabled={updateAvailability.isPending}
                >
                  {updateAvailability.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {selectedStatus === 'BLOCKED' ? 'Mark as Available' : 'Block This Date'}
                </Button>

                {selectedStatus === 'BLOCKED' && (
                  <p className="text-sm text-muted text-center">
                    Unblocking will allow customers to book this date
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
