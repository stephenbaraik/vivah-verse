'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { Button, DatePicker, Card } from '@/components/ui';
import { useOnboardingStore } from '@/stores/onboarding-store';
import OnboardingLayout from './layout-client';

// Sample auspicious dates for 2026
const AUSPICIOUS_DATES = [
  new Date(2026, 0, 26), // Jan 26
  new Date(2026, 1, 14), // Feb 14
  new Date(2026, 2, 15), // Mar 15
  new Date(2026, 3, 18), // Apr 18
  new Date(2026, 4, 10), // May 10
  new Date(2026, 10, 22), // Nov 22
  new Date(2026, 11, 12), // Dec 12
];

export default function OnboardingWeddingDatePage() {
  const router = useRouter();
  const { weddingDate, isMultiDay: storedMultiDay, setDateInfo } = useOnboardingStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    weddingDate ?? undefined
  );
  const [isMultiDay, setIsMultiDay] = useState(storedMultiDay);

  // Sync from store on mount
  useEffect(() => {
    if (weddingDate) {
      const frame = requestAnimationFrame(() => setSelectedDate(weddingDate));
      return () => cancelAnimationFrame(frame);
    }
  }, [weddingDate]);

  const isAuspicious = selectedDate && AUSPICIOUS_DATES.some(
    d => d.toDateString() === selectedDate.toDateString()
  );

  const handleContinue = () => {
    if (!selectedDate) return;
    setDateInfo(selectedDate, isMultiDay);
    router.push('/onboarding/couple');
  };

  return (
    <OnboardingLayout currentStep={1}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">
          When is your wedding?
        </h1>
        <p className="text-muted text-lg">
          Let&apos;s start planning your perfect day together
        </p>
      </motion.div>

      {/* Date Picker Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          minDate={new Date()}
          auspiciousDates={AUSPICIOUS_DATES}
          className="mb-6"
        />
      </motion.div>

      {/* Auspicious date tooltip */}
      {isAuspicious && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card variant="accent" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Auspicious Date!</p>
              <p className="text-sm text-muted">
                This is considered a favorable date for weddings
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Multi-day toggle */}
      <Card className="mb-6">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-muted" />
            <div>
              <p className="font-medium text-charcoal">Multi-day wedding?</p>
              <p className="text-sm text-muted">
                Sangeet, Mehendi, and other ceremonies
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isMultiDay}
            onChange={(e) => setIsMultiDay(e.target.checked)}
            className="w-5 h-5 rounded border-divider text-rani focus:ring-gold"
          />
        </label>
      </Card>

      {/* Selected date summary */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-center"
        >
          <p className="text-muted">Your wedding date</p>
          <p className="text-2xl font-serif font-semibold text-charcoal">
            {selectedDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </motion.div>
      )}

      {/* Continue button - sticky on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-divider md:relative md:p-0 md:bg-transparent md:border-0">
        <Button
          fullWidth
          size="lg"
          disabled={!selectedDate}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}
