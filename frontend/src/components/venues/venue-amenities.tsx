'use client';

import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import type { Venue } from '@/types/api';

interface VenueAmenitiesProps {
  venue: Venue;
}

/**
 * Amenities grid for venue detail page
 */
export function VenueAmenities({ venue }: VenueAmenitiesProps) {
  const amenities = venue.amenities?.length > 0 ? venue.amenities : [
    'Valet Parking',
    'In-house Catering',
    'Bridal Suite',
    'DJ & Sound System',
    'Decor Services',
    'Air Conditioning',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {amenities.map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-sm text-charcoal">{amenity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
