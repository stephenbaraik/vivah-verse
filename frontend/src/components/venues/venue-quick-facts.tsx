'use client';

import { MapPin, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Venue } from '@/types/api';

interface VenueQuickFactsProps {
  venue: Venue;
}

/**
 * Quick facts strip showing key venue metrics
 */
export function VenueQuickFacts({ venue }: VenueQuickFactsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="text-center p-4 rounded-lg bg-white shadow-card">
        <MapPin className="w-5 h-5 text-muted mx-auto mb-2" />
        <p className="text-xs text-muted mb-1">City</p>
        <p className="font-medium text-charcoal">{venue.city}</p>
      </div>
      
      <div className="text-center p-4 rounded-lg bg-white shadow-card">
        <Users className="w-5 h-5 text-muted mx-auto mb-2" />
        <p className="text-xs text-muted mb-1">Capacity</p>
        <p className="font-medium text-charcoal">{venue.capacity} guests</p>
      </div>
      
      <div className="text-center p-4 rounded-lg bg-white shadow-card">
        <span className="text-xl block mb-1">🍽️</span>
        <p className="text-xs text-muted mb-1">Starting at</p>
        <p className="font-medium text-rani">
          {formatCurrency(venue.pricePerPlate)}
          <span className="text-xs text-muted font-normal">/plate</span>
        </p>
      </div>
    </div>
  );
}
