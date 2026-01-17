'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import type { Venue } from '@/types/api';

interface VenueDescriptionProps {
  venue: Venue;
}

/**
 * Description section for venue detail page
 */
export function VenueDescription({ venue }: VenueDescriptionProps) {
  const description = venue.description || 
    'A beautiful venue perfect for your special day. Contact us for more details about amenities, catering options, and availability.';

  return (
    <Card>
      <CardHeader>
        <CardTitle>About this venue</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted leading-relaxed">{description}</p>
        
        {venue.cuisineTypes?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-divider">
            <p className="text-sm font-medium text-charcoal mb-2">Cuisine Types</p>
            <div className="flex flex-wrap gap-2">
              {venue.cuisineTypes.map((cuisine, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-rose-soft text-rani text-sm rounded-full"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
