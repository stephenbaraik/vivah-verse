'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

// Sample featured venues - in production, this comes from API
const FEATURED_VENUES = [
  {
    id: '1',
    name: 'The Grand Udaipur Palace',
    city: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    pricePerPlate: 3500,
    maxCapacity: 1000,
    rating: 4.9,
    reviewCount: 128,
    badge: 'Most Popular',
  },
  {
    id: '2',
    name: 'Seaside Paradise Resort',
    city: 'Goa',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    pricePerPlate: 2800,
    maxCapacity: 500,
    rating: 4.8,
    reviewCount: 89,
    badge: 'Beach Wedding',
  },
  {
    id: '3',
    name: 'Royal Garden Estate',
    city: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    pricePerPlate: 3200,
    maxCapacity: 800,
    rating: 4.9,
    reviewCount: 156,
    badge: 'Heritage',
  },
  {
    id: '4',
    name: 'The Leela Mumbai',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    pricePerPlate: 4200,
    maxCapacity: 600,
    rating: 4.7,
    reviewCount: 203,
    badge: 'Luxury',
  },
  {
    id: '5',
    name: 'Backwater Bliss',
    city: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    pricePerPlate: 2500,
    maxCapacity: 300,
    rating: 4.8,
    reviewCount: 67,
    badge: 'Destination',
  },
];

export function FeaturedVenues() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 full-bleed px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-gold mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Handpicked for You</span>
            </div>
            <h2 className="text-3xl font-serif font-semibold text-charcoal">
              Featured Venues
            </h2>
            <p className="text-muted mt-2">
              Discover our most loved wedding destinations across India
            </p>
          </div>
          <Link href="/venues" className="mt-4 md:mt-0">
            <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Venues
            </Button>
          </Link>
        </motion.div>

        {/* Carousel */}
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-soft"
          >
            <ChevronLeft className="w-6 h-6 text-charcoal" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-soft"
          >
            <ChevronRight className="w-6 h-6 text-charcoal" />
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {FEATURED_VENUES.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link href={`/venues/${venue.id}`}>
                  <Card
                    interactive
                    padding="none"
                    className="w-[280px] sm:w-[320px] flex-shrink-0 overflow-hidden group/card"
                  >
                    {/* Image */}
                    <div className="relative h-44 sm:h-52 overflow-hidden">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      {/* Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-rani to-gold text-white text-xs font-semibold rounded-full shadow-lg">
                        {venue.badge}
                      </div>
                      {/* Rating */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-sm font-semibold text-charcoal">{venue.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-serif font-semibold text-lg text-charcoal mb-1 line-clamp-1">
                        {venue.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {venue.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Up to {venue.maxCapacity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-rani font-semibold">
                          {formatCurrency(venue.pricePerPlate)}
                          <span className="text-xs text-muted font-normal">/plate</span>
                        </p>
                        <span className="text-xs text-muted">
                          {venue.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
