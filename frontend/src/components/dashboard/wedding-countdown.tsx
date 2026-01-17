'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar } from 'lucide-react';

interface WeddingCountdownProps {
  weddingDate: string | Date;
  partnerNames?: { partner1: string; partner2: string };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (target: Date): TimeLeft => {
  const now = new Date();
  const difference = target.getTime() - now.getTime();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export function WeddingCountdown({ weddingDate, partnerNames }: WeddingCountdownProps) {
  const targetDate = useMemo(() => new Date(weddingDate), [weddingDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(new Date(weddingDate)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = targetDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isPast = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isPast) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rani via-[#D35A7A] to-gold p-8 text-white"
      >
        <div className="absolute inset-0 bg-[url('/patterns/mandala.svg')] opacity-10" />
        <div className="relative text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4"
          >
            <Heart className="w-8 h-8 fill-white" />
          </motion.div>
          <h2 className="text-3xl font-serif font-bold mb-2">Congratulations!</h2>
          {partnerNames && (
            <p className="text-xl text-white/90 mb-2">
              {partnerNames.partner1} & {partnerNames.partner2}
            </p>
          )}
          <p className="text-white/80">Your wedding day has arrived! ✨</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rani via-[#D35A7A] to-gold p-6 md:p-8 text-white"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/patterns/mandala.svg')] opacity-10" />
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-24 h-24" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm mb-3">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          {partnerNames && (
            <h2 className="text-2xl md:text-3xl font-serif font-bold">
              {partnerNames.partner1} & {partnerNames.partner2}
            </h2>
          )}
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <CountdownUnit value={timeLeft.minutes} label="Minutes" />
          <CountdownUnit value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Milestone indicators */}
        {timeLeft.days <= 30 && timeLeft.days > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-white/90 text-sm md:text-base">
              {timeLeft.days <= 7 
                ? "🎉 Almost there! Final countdown!" 
                : timeLeft.days <= 14 
                  ? "💫 Two weeks to go - exciting times!" 
                  : "📋 One month left - finish your checklist!"}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 mb-2"
      >
        <span className="text-2xl md:text-4xl lg:text-5xl font-bold font-serif">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm text-white/80 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default WeddingCountdown;
