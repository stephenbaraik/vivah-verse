'use client';

import { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Calendar, Users, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Card } from '@/components/ui';
import { VenueCard, VenueCardSkeleton, NoVenuesFound } from '@/components/venues';
import { useVenueFilters, useVenuesQuery } from '@/features/venues';
import type { VenueSearchParams } from '@/types/api';
import { useWeddingDateStore } from '@/stores/wedding-date-store';
import { cn } from '@/lib/utils';

function VenuesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { weddingDate } = useWeddingDateStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'recommended'
  );
  
  // Get date from URL for display
  const urlDate = searchParams.get('date');
  const displayDate = urlDate ? new Date(urlDate) : weddingDate;
  
  // Local filter state
  const filters = useVenueFilters();
  
  // Server state - only query when valid filters
  const queryParams = useMemo(() => {
    const mappedSort: Partial<VenueSearchParams> = (() => {
      if (sortBy === 'price-asc') return { sortBy: 'basePrice', sortDir: 'asc' as const };
      if (sortBy === 'price-desc') return { sortBy: 'basePrice', sortDir: 'desc' as const };
      // Let backend relevance/ranking handle recommended & rating
      return {};
    })();

    return {
      ...filters.params,
      q: searchQuery || undefined,
      ...mappedSort,
    };
  }, [filters.params, searchQuery, sortBy]);

  const { data, isLoading, error } = useVenuesQuery(queryParams, {
    enabled: filters.isValid || Boolean(searchQuery),
  });

  // Get venues from paginated response
  const venues = useMemo(() => data?.data ?? [], [data]);
  
  const filteredVenues = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = q
      ? venues.filter(
          (venue) =>
            venue.name.toLowerCase().includes(q) ||
            venue.city.toLowerCase().includes(q)
        )
      : venues;

    if (sortBy === 'rating-desc') {
      return [...base].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return base;
  }, [searchQuery, sortBy, venues]);

  const activeChips: Array<{ key: string; label: string; onClear: () => void }> = [];

  if (filters.city) {
    activeChips.push({
      key: 'city',
      label: filters.city,
      onClear: () => filters.setCity(''),
    });
  }

  if (filters.date) {
    activeChips.push({
      key: 'date',
      label: `Date: ${filters.date}`,
      onClear: () => filters.setDate(''),
    });
  }

  if (filters.guests) {
    activeChips.push({
      key: 'guests',
      label: `Guests: ${filters.guests}`,
      onClear: () => filters.setGuests(null),
    });
  }

  if (filters.minPrice) {
    activeChips.push({
      key: 'minPrice',
      label: `Min ₹${filters.minPrice}/plate`,
      onClear: () => filters.setMinPrice(null),
    });
  }

  if (filters.maxPrice) {
    activeChips.push({
      key: 'maxPrice',
      label: `Max ₹${filters.maxPrice}/plate`,
      onClear: () => filters.setMaxPrice(null),
    });
  }

  for (const amenity of filters.amenities) {
    activeChips.push({
      key: `amenity:${amenity}`,
      label: amenity,
      onClear: () => filters.toggleAmenity(amenity),
    });
  }

  // AI concierge redirect
  const handleAskAI = () => {
    router.push('/concierge?context=venue-search');
  };
  
  // Navigate back to change date
  const handleChangeDate = () => {
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
      <div className="space-y-4 sm:space-y-6">
      {/* Date Context Banner - shows when coming from date picker */}
      {displayDate && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-rani/10 via-rose-soft to-gold/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-rani/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-rani" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted">Showing venues available on</p>
              <p className="font-medium text-charcoal text-sm sm:text-base">
                {displayDate.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleChangeDate} leftIcon={<ArrowLeft className="w-4 h-4" />} className="w-full sm:w-auto">
            Change Date
          </Button>
        </motion.div>
      )}
    
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-semibold text-charcoal">
            Wedding Venues
          </h1>
          <p className="text-muted text-sm sm:text-base">
            {!isLoading && (filters.isValid || searchQuery)
              ? `${data?.total ?? filteredVenues.length} venues available`
              : 'Search for your perfect venue'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 md:w-80">
            <Input
              placeholder="Search venues or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-4 h-4" />
                  </button>
                )
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="h-11 px-3 border border-divider rounded-md bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-rani focus:border-transparent"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'
                )
              }
              aria-label="Sort venues"
            >
              <option value="recommended">Recommended</option>
              <option value="rating-desc">Highest rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>

            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {filters.isValid && (activeChips.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-2 rounded-full border border-divider bg-white px-3 py-1.5 text-sm text-charcoal hover:border-rani"
            >
              <span>Search: {searchQuery}</span>
              <X className="h-4 w-4 text-muted" />
            </button>
          ) : null}

          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onClear}
              className="inline-flex items-center gap-2 rounded-full border border-divider bg-white px-3 py-1.5 text-sm text-charcoal hover:border-rani"
            >
              <span>{chip.label}</span>
              <X className="h-4 w-4 text-muted" />
            </button>
          ))}

          <Button variant="ghost" size="sm" onClick={filters.reset}>
            Clear all
          </Button>
        </div>
      )}

      {/* Search Filters - Main */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              City
            </label>
            <select
              className="w-full px-3 py-2 border border-divider rounded-md bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-rani focus:border-transparent"
              value={filters.city}
              onChange={(e) => filters.setCity(e.target.value)}
            >
              <option value="">All cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Udaipur">Udaipur</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Goa">Goa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Wedding Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => filters.setDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Guest Count
            </label>
            <Input
              type="number"
              placeholder="e.g., 300"
              value={filters.guests ?? ''}
              onChange={(e) =>
                filters.setGuests(e.target.value ? Number(e.target.value) : null)
              }
              leftIcon={<Users className="w-4 h-4" />}
              min={1}
            />
          </div>
        </div>
      </Card>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Min Price/Plate
                  </label>
                  <Input
                    type="number"
                    placeholder="₹500"
                    value={filters.minPrice ?? ''}
                    onChange={(e) =>
                      filters.setMinPrice(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Max Price/Plate
                  </label>
                  <Input
                    type="number"
                    placeholder="₹5000"
                    value={filters.maxPrice ?? ''}
                    onChange={(e) =>
                      filters.setMaxPrice(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Parking', 'AC', 'DJ', 'Catering', 'Decor'].map(
                      (amenity) => (
                        <button
                          key={amenity}
                          onClick={() => filters.toggleAmenity(amenity)}
                          className={cn(
                            'px-3 py-1 text-sm rounded-full border transition-colors',
                            filters.amenities.includes(amenity)
                              ? 'bg-rani text-white border-rani'
                              : 'bg-white text-charcoal border-divider hover:border-rani'
                          )}
                        >
                          {amenity}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={filters.reset}>
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <VenueCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="p-8 text-center">
          <p className="text-error mb-4">Failed to load venues</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      )}

      {/* Empty State - No filters applied yet */}
      {!isLoading && !error && !filters.isValid && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-soft flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-rani" />
          </div>
          <h3 className="text-lg font-semibold font-serif text-charcoal mb-2">
            Start Your Search
          </h3>
          <p className="text-muted max-w-md mx-auto">
            Select a city, date, and guest count to find available venues for your 
            special day.
          </p>
        </div>
      )}

      {/* Empty State - No results */}
      {!isLoading && !error && filters.isValid && filteredVenues.length === 0 && (
        <NoVenuesFound
          onClearFilters={filters.reset}
          onAskAI={handleAskAI}
        />
      )}

      {/* Venues Grid */}
      {!isLoading && !error && filteredVenues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue, index) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              priority={index < 3}
              aiConfidence={
                index % 4 === 0 ? 'high' : index % 4 === 1 ? 'medium' : undefined
              }
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function VenuesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <div className="space-y-6">
          <div className="h-20 bg-rose-soft/50 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VenueCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <VenuesContent />
    </Suspense>
  );
}
