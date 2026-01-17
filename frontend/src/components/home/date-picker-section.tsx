'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  MapPin,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GUEST_OPTIONS = [
  { value: 50, label: 'Intimate (up to 50)' },
  { value: 100, label: 'Small (51-100)' },
  { value: 200, label: 'Medium (101-200)' },
  { value: 400, label: 'Large (201-400)' },
  { value: 500, label: 'Grand (400+)' },
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Udaipur',
  'Chennai', 'Hyderabad', 'Goa', 'Kerala', 'Kolkata',
];

// Auspicious dates for 2026
const AUSPICIOUS_DATES = [
  new Date(2026, 0, 14), new Date(2026, 0, 25), new Date(2026, 0, 29),
  new Date(2026, 1, 5), new Date(2026, 1, 12), new Date(2026, 1, 26),
  new Date(2026, 2, 2), new Date(2026, 2, 10), new Date(2026, 2, 14),
  new Date(2026, 3, 20), new Date(2026, 3, 25),
  new Date(2026, 4, 7), new Date(2026, 4, 15), new Date(2026, 4, 26),
  new Date(2026, 5, 8), new Date(2026, 5, 22),
  new Date(2026, 10, 12), new Date(2026, 10, 25),
  new Date(2026, 11, 2), new Date(2026, 11, 7), new Date(2026, 11, 12),
];

interface DatePickerSectionProps {
  onFindVenues: (date: Date, guests?: number, city?: string) => void;
}

export function DatePickerSection({ onFindVenues }: DatePickerSectionProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [step, setStep] = useState<'date' | 'details'>('date');

  const minDate = useMemo(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 3);
    return today;
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isAuspicious = (date: Date) =>
    AUSPICIOUS_DATES.some((d) => d.toDateString() === date.toDateString());
  const isDisabled = (date: Date) => date < minDate;
  const isSelected = (date: Date) => selectedDate?.toDateString() === date.toDateString();
  const isToday = (date: Date) => new Date().toDateString() === date.toDateString();
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const days = getDaysInMonth(currentMonth);

  const handleDateSelect = (date: Date) => {
    if (isDisabled(date)) return;
    setSelectedDate(date);
  };

  const handleContinue = () => {
    if (!selectedDate) return;
    setStep('details');
  };

  const handleFindVenues = () => {
    if (!selectedDate) return;
    onFindVenues(selectedDate, guestCount ?? undefined, selectedCity || undefined);
  };

  return (
    <section id="planning-section" className="section-sm">
      <div className="container max-w-xl">
        <AnimatePresence mode="wait">
          {step === 'date' ? (
            <motion.div
              key="date-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/35 backdrop-blur-2xl border border-white/35 shadow-[var(--shadow-glass)] mb-4"
                >
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-gold" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-2">
                  When is your special day?
                </h2>
                <p className="text-muted text-sm sm:text-base md:text-lg">
                  Select your wedding date and we&apos;ll show you available venues
                </p>
              </div>

              {/* Calendar */}
              <div className="bg-white/55 backdrop-blur-2xl rounded-2xl shadow-[var(--shadow-glass)] border border-white/40 p-4 sm:p-6 md:p-8">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 sm:p-2 rounded-full bg-white/35 border border-white/30 backdrop-blur-xl hover:bg-white/55 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                  </button>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-charcoal">
                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 sm:p-2 rounded-full bg-white/35 border border-white/30 backdrop-blur-xl hover:bg-white/55 transition-all"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  {DAYS.map((day) => (
                    <div key={day} className="text-center text-[10px] sm:text-xs md:text-sm font-medium text-muted py-1 sm:py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {days.map((date, idx) => (
                    <div key={idx} className="aspect-square">
                      {date ? (
                        <motion.button
                          whileHover={{ scale: isDisabled(date) ? 1 : 1.1 }}
                          whileTap={{ scale: isDisabled(date) ? 1 : 0.95 }}
                          onClick={() => handleDateSelect(date)}
                          disabled={isDisabled(date)}
                          className={cn(
                            'relative w-full h-full flex items-center justify-center',
                            'rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
                            isDisabled(date) && 'text-muted/40 cursor-not-allowed',
                            !isDisabled(date) && !isSelected(date) && 'hover:bg-white/45 hover:shadow-[var(--shadow-glass)]',
                            isToday(date) && !isSelected(date) && 'font-semibold text-rani',
                            isSelected(date) && 'bg-gradient-to-br from-rani to-rani/80 text-white shadow-[var(--shadow-glow-rani)]',
                            isWeekend(date) && !isSelected(date) && !isDisabled(date) && 'text-rani/80',
                            isAuspicious(date) && !isSelected(date) && !isDisabled(date) && 'ring-2 ring-gold ring-offset-1'
                          )}
                        >
                          <span>{date.getDate()}</span>
                          {isAuspicious(date) && (
                            <Sparkles className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                          )}
                        </motion.button>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-divider/50">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg ring-2 ring-gold flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                    </div>
                    <span>Auspicious</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-br from-rani to-rani/80" />
                    <span>Selected</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 sm:mt-6"
                  >
                    <div className="bg-white rounded-xl shadow-sm shadow-charcoal/10 border border-divider/30 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-soft flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-rani" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal text-sm sm:text-base">
                            {selectedDate.toLocaleDateString('en-IN', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                          {isAuspicious(selectedDate) && (
                            <p className="text-[10px] sm:text-xs text-gold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Auspicious date
                            </p>
                          )}
                        </div>
                      </div>
                      <Button onClick={handleContinue} rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="details-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold to-gold/70 mb-4"
                >
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-2">
                  A few more details
                </h2>
                <p className="text-muted text-sm sm:text-base md:text-lg">Help us find the perfect venues for you</p>
              </div>

              {/* Selected date card */}
              <div className="bg-white rounded-xl shadow-sm shadow-charcoal/10 border border-divider/30 p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-soft flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-rani" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal text-sm sm:text-base truncate">
                    {selectedDate?.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {selectedDate && isAuspicious(selectedDate) && (
                    <p className="text-[10px] sm:text-xs text-gold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Auspicious date
                    </p>
                  )}
                </div>
                <button onClick={() => setStep('date')} className="text-xs sm:text-sm text-rani font-semibold hover:underline shrink-0">
                  Change
                </button>
              </div>

              {/* Details form */}
              <div className="bg-white rounded-2xl shadow-sm shadow-charcoal/10 border border-divider/30 p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Guest count */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal mb-2 sm:mb-3">
                    <Users className="w-4 h-4 text-rani" />
                    Expected guest count
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GUEST_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGuestCount(option.value)}
                        className={cn(
                          'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-xs sm:text-sm font-medium transition-all',
                          guestCount === option.value
                            ? 'border-rani bg-rani/10 text-rani'
                            : 'border-divider/50 text-charcoal hover:border-rani/50'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City preference */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal mb-2 sm:mb-3">
                    <MapPin className="w-4 h-4 text-rani" />
                    Preferred city (optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(selectedCity === city ? '' : city)}
                        className={cn(
                          'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-all',
                          selectedCity === city
                            ? 'border-rani bg-rani text-white'
                            : 'border-divider/50 text-charcoal hover:border-rani/50'
                        )}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <Button variant="secondary" onClick={() => setStep('date')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleFindVenues}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="flex-1"
                >
                  Find Venues
                </Button>
              </div>

              {/* Skip link */}
              <p className="text-center text-xs sm:text-sm text-muted mt-3 sm:mt-4">
                Not sure yet?{' '}
                <button onClick={handleFindVenues} className="text-rani font-semibold hover:underline">
                  Skip and browse all venues
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
