'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  MapPin,
  Users,
  IndianRupee,
  Star,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  EmptyState,
} from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

// Mock saved venues - in production this would come from API/localStorage
const MOCK_FAVORITES = [
  {
    id: '1',
    name: 'The Grand Palace',
    city: 'Mumbai',
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
    capacity: 500,
    pricePerPlate: 2500,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Royal Garden Resort',
    city: 'Jaipur',
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
    capacity: 300,
    pricePerPlate: 1800,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Lakeside Retreat',
    city: 'Udaipur',
    images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
    capacity: 200,
    pricePerPlate: 3500,
    rating: 4.9,
    reviewCount: 67,
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((venue) => venue.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Saved Venues
          </h1>
          <p className="text-muted mt-1">
            Your favorite venues for easy access
          </p>
        </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved venues yet"
          description="Browse venues and save your favorites to compare later"
          action={
            <Link href="/venues">
              <Button>
                Explore Venues
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favorites.map((venue) => (
            <motion.div key={venue.id} variants={fadeIn}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={venue.images[0]}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => removeFavorite(venue.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rani fill-rani" />
                  </button>
                  {venue.rating && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-xs font-medium">{venue.rating}</span>
                      <span className="text-xs text-muted">({venue.reviewCount})</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="py-4">
                  <Link href={`/venues/${venue.id}`}>
                    <h3 className="font-medium text-charcoal hover:text-rani transition-colors">
                      {venue.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-muted mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{venue.city}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider">
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {venue.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {formatCurrency(venue.pricePerPlate)}/plate
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link href={`/venues/${venue.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/booking?venue=${venue.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {favorites.length > 0 && (
        <div className="text-center">
          <Link href="/venues">
            <Button variant="outline">
              Explore More Venues
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}
