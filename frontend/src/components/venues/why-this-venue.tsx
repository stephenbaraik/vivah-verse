'use client';

import { Sparkles } from 'lucide-react';
import { AIBadge } from '@/components/ai';

interface WhyThisVenueProps {
  reasons?: string[];
  className?: string;
}

/**
 * AI explainability panel - trust builder for venue recommendations
 */
export function WhyThisVenue({ reasons, className }: WhyThisVenueProps) {
  const defaultReasons = [
    'Matches your guest count comfortably',
    'Popular for weddings in this city',
    'Well-rated vendor with reliable bookings',
    'Within your budget range',
  ];

  const displayReasons = reasons?.length ? reasons : defaultReasons;

  return (
    <div className={`rounded-lg border border-gold/40 p-5 bg-white shadow-card ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-gold" />
        <p className="text-sm font-semibold text-charcoal">
          Why this venue is a great fit
        </p>
        <AIBadge confidence="high" />
      </div>
      
      <ul className="text-sm text-muted space-y-2">
        {displayReasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-success mt-0.5">✓</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
