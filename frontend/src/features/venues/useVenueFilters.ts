'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { VenueSearchParams } from '@/types/api';

/**
 * Local state hook for venue search filters
 * Manages user input before sending to server
 * Now supports URL params for deep linking from home page
 */
export function useVenueFilters() {
  const searchParams = useSearchParams();
  
  // Initialize from URL params if present
  const [city, setCity] = useState(() => searchParams.get('city') || '');
  const [date, setDate] = useState(() => searchParams.get('date') || '');
  const [guests, setGuests] = useState<number | null>(() => {
    const g = searchParams.get('guests');
    return g ? parseInt(g, 10) : null;
  });
  const [minPrice, setMinPrice] = useState<number | null>(() => {
    const v = searchParams.get('minPrice');
    return v ? parseInt(v, 10) : null;
  });
  const [maxPrice, setMaxPrice] = useState<number | null>(() => {
    const v = searchParams.get('maxPrice');
    return v ? parseInt(v, 10) : null;
  });
  const [amenities, setAmenities] = useState<string[]>(() => {
    const raw = searchParams.getAll('amenities');
    if (raw.length > 0)
      return raw
        .flatMap((r) => r.split(','))
        .map((r) => r.trim())
        .filter(Boolean);
    const csv = searchParams.get('amenities');
    return csv
      ? csv
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean)
      : [];
  });

  // Check if we have minimum filters to search
  const isValid = useMemo(
    () => Boolean(city || date || guests || minPrice || maxPrice || amenities.length),
    [city, date, guests, minPrice, maxPrice, amenities]
  );

  // Build query params object
  const params: VenueSearchParams = useMemo(
    () => ({
      city: city || undefined,
      date: date || undefined,
      guests: guests ?? undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
    }),
    [city, date, guests, minPrice, maxPrice, amenities]
  );

  // Reset all filters
  const reset = useCallback(() => {
    setCity('');
    setDate('');
    setGuests(null);
    setMinPrice(null);
    setMaxPrice(null);
    setAmenities([]);
  }, []);

  // Toggle an amenity
  const toggleAmenity = useCallback((amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }, []);

  return {
    // Current values
    city,
    date,
    guests,
    minPrice,
    maxPrice,
    amenities,
    // Setters
    setCity,
    setDate,
    setGuests,
    setMinPrice,
    setMaxPrice,
    toggleAmenity,
    // Computed
    isValid,
    params,
    // Actions
    reset,
  };
}
