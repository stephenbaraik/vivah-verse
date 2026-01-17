'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  MapPin, 
  Star, 
  Check, 
  Minus,
  Sparkles
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';

// Sample venues for comparison
const ALL_VENUES = [
  {
    id: '1',
    name: 'The Grand Palace',
    city: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    pricePerPlate: 3500,
    maxCapacity: 1000,
    rating: 4.9,
    reviewCount: 128,
    amenities: ['Catering', 'Parking', 'DJ', 'WiFi', 'AC', 'Decor', 'Rooms'],
    venueType: 'Palace',
    outdoorSpace: true,
    inHouseCatering: true,
    alcoholAllowed: true,
    vegOnly: false,
  },
  {
    id: '2',
    name: 'Seaside Paradise',
    city: 'Goa',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    pricePerPlate: 2800,
    maxCapacity: 500,
    rating: 4.8,
    reviewCount: 89,
    amenities: ['Catering', 'Parking', 'DJ', 'WiFi', 'Decor'],
    venueType: 'Resort',
    outdoorSpace: true,
    inHouseCatering: true,
    alcoholAllowed: true,
    vegOnly: false,
  },
  {
    id: '3',
    name: 'Royal Garden Estate',
    city: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
    pricePerPlate: 3200,
    maxCapacity: 800,
    rating: 4.9,
    reviewCount: 156,
    amenities: ['Catering', 'Parking', 'DJ', 'WiFi', 'AC', 'Decor', 'Rooms', 'Spa'],
    venueType: 'Heritage',
    outdoorSpace: true,
    inHouseCatering: true,
    alcoholAllowed: true,
    vegOnly: false,
  },
  {
    id: '4',
    name: 'The Leela Mumbai',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    pricePerPlate: 4200,
    maxCapacity: 600,
    rating: 4.7,
    reviewCount: 203,
    amenities: ['Catering', 'Valet', 'DJ', 'WiFi', 'AC', 'Decor', 'Rooms', 'Spa', 'Pool'],
    venueType: 'Hotel',
    outdoorSpace: false,
    inHouseCatering: true,
    alcoholAllowed: true,
    vegOnly: false,
  },
  {
    id: '5',
    name: 'Lakeside Retreat',
    city: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
    pricePerPlate: 2500,
    maxCapacity: 300,
    rating: 4.8,
    reviewCount: 67,
    amenities: ['Catering', 'Parking', 'WiFi', 'AC', 'Decor'],
    venueType: 'Resort',
    outdoorSpace: true,
    inHouseCatering: true,
    alcoholAllowed: false,
    vegOnly: true,
  },
];

const COMPARISON_FEATURES = [
  { key: 'pricePerPlate', label: 'Price per Plate', format: 'currency' },
  { key: 'maxCapacity', label: 'Max Capacity', format: 'number' },
  { key: 'rating', label: 'Rating', format: 'rating' },
  { key: 'venueType', label: 'Venue Type', format: 'text' },
  { key: 'outdoorSpace', label: 'Outdoor Space', format: 'boolean' },
  { key: 'inHouseCatering', label: 'In-House Catering', format: 'boolean' },
  { key: 'alcoholAllowed', label: 'Alcohol Allowed', format: 'boolean' },
  { key: 'vegOnly', label: 'Veg Only', format: 'boolean' },
] as const;

export default function VenueComparePage() {
  const [selectedVenues, setSelectedVenues] = useState<string[]>(['1', '2']);
  const [showSelector, setShowSelector] = useState(false);

  const comparedVenues = selectedVenues
    .map((id) => ALL_VENUES.find((v) => v.id === id))
    .filter(Boolean) as typeof ALL_VENUES;

  const availableVenues = ALL_VENUES.filter((v) => !selectedVenues.includes(v.id));

  const addVenue = (id: string) => {
    if (selectedVenues.length < 4) {
      setSelectedVenues([...selectedVenues, id]);
      setShowSelector(false);
    }
  };

  const removeVenue = (id: string) => {
    setSelectedVenues(selectedVenues.filter((v) => v !== id));
  };

  const formatValue = (value: unknown, format: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value as number);
      case 'number':
        return (value as number).toLocaleString();
      case 'rating':
        return (
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            {String(value)}
          </span>
        );
      case 'boolean':
        return value ? (
          <Check className="w-5 h-5 text-success" />
        ) : (
          <Minus className="w-5 h-5 text-muted" />
        );
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <Link href="/venues" className="inline-flex items-center gap-2 text-muted hover:text-charcoal mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Venues
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">
            Compare Venues
          </h1>
          <p className="text-muted">
            Compare up to 4 venues side by side to find your perfect match
          </p>
        </motion.div>
      </section>

      {/* Venue Cards */}
      <section className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {comparedVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-64 flex-shrink-0"
            >
              <Card padding="none" className="overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeVenue(venue.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-charcoal" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-charcoal line-clamp-1">{venue.name}</h3>
                  <p className="text-sm text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {venue.city}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Add Venue Button */}
          {selectedVenues.length < 4 && (
            <div className="w-64 flex-shrink-0">
              <button
                onClick={() => setShowSelector(!showSelector)}
                className={cn(
                  "w-full h-full min-h-[220px] rounded-xl border-2 border-dashed",
                  "flex flex-col items-center justify-center gap-2",
                  "transition-colors",
                  showSelector
                    ? "border-rani bg-rani/5"
                    : "border-divider hover:border-rani hover:bg-rose-soft"
                )}
              >
                <Plus className={cn("w-8 h-8", showSelector ? "text-rani" : "text-muted")} />
                <span className={cn("font-medium", showSelector ? "text-rani" : "text-muted")}>
                  Add Venue
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Venue Selector Modal */}
      {showSelector && availableVenues.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-elevated p-6"
        >
          <h3 className="font-semibold text-charcoal mb-4">Select a venue to compare</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableVenues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => addVenue(venue.id)}
                className="flex items-center gap-3 p-3 rounded-lg border border-divider hover:border-rani hover:bg-rose-soft transition-all text-left"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={venue.image} alt={venue.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">{venue.name}</p>
                  <p className="text-sm text-muted">{venue.city}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Comparison Table */}
      {comparedVenues.length >= 2 && (
        <section className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-rose-soft rounded-tl-xl font-medium text-charcoal w-48">
                  Feature
                </th>
                {comparedVenues.map((venue, idx) => (
                  <th
                    key={venue.id}
                    className={cn(
                      "text-center py-3 px-4 bg-rose-soft font-medium text-charcoal",
                      idx === comparedVenues.length - 1 && "rounded-tr-xl"
                    )}
                  >
                    {venue.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((feature, idx) => (
                <tr key={feature.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-rose-soft/30'}>
                  <td className="py-4 px-4 text-sm font-medium text-charcoal">
                    {feature.label}
                  </td>
                  {comparedVenues.map((venue) => (
                    <td key={venue.id} className="py-4 px-4 text-center text-sm text-charcoal">
                      <div className="flex items-center justify-center">
                        {formatValue(venue[feature.key as keyof typeof venue], feature.format)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Amenities Row */}
              <tr className="bg-white">
                <td className="py-4 px-4 text-sm font-medium text-charcoal">
                  Amenities
                </td>
                {comparedVenues.map((venue) => (
                  <td key={venue.id} className="py-4 px-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {venue.amenities.slice(0, 5).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 bg-rose-soft text-rani text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 5 && (
                        <span className="px-2 py-0.5 bg-divider text-muted text-xs rounded-full">
                          +{venue.amenities.length - 5} more
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* Action Buttons */}
      {comparedVenues.length >= 1 && (
        <section className="flex flex-wrap justify-center gap-4">
          {comparedVenues.map((venue) => (
            <Link key={venue.id} href={`/venues/${venue.id}`}>
              <Button variant="secondary">
                View {venue.name}
              </Button>
            </Link>
          ))}
        </section>
      )}

      {/* Empty State */}
      {comparedVenues.length < 2 && (
        <section className="text-center py-12">
          <Sparkles className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-charcoal mb-2">
            Select at least 2 venues to compare
          </h2>
          <p className="text-muted mb-6">
            Add venues from the options above to see a detailed comparison
          </p>
          <Link href="/venues">
            <Button>Browse Venues</Button>
          </Link>
        </section>
      )}
    </div>
  );
}
