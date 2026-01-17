'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Heart, TrendingUp, Eye, Flame, Calendar, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui';
import { AIBadge } from '@/components/ai';
import { formatCurrency, cn } from '@/lib/utils';
import type { Venue } from '@/types/api';

type UrgencyData = {
  datesLeft: number;
  isPopular: boolean;
  isNew: boolean;
  hasDiscount: boolean;
  discountPercent: number;
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const buildUrgencyData = (venue: Venue): UrgencyData => {
  const seedSource = venue.id || venue.name || 'venue';
  const hash = hashString(seedSource);

  const pick = (offset: number, min: number, max: number) => {
    const range = max - min + 1;
    return ((hash >> offset) % range) + min;
  };

  const boolFrom = (offset: number, threshold = 5) => ((hash >> offset) % 10) > threshold;

  const datesLeft = pick(2, 1, 8);
  const isPopular = venue.rating ? venue.rating >= 4.5 : boolFrom(4, 6);
  const isNew = boolFrom(6, 7);
  const hasDiscount = boolFrom(8, 7);
  const discountPercent = hasDiscount ? pick(10, 5, 19) : 0;

  return { datesLeft, isPopular, isNew, hasDiscount, discountPercent };
};

interface VenueCardProps {
  venue: Venue;
  priority?: boolean;
  aiConfidence?: 'high' | 'medium' | 'low';
  showUrgency?: boolean;
}

export function VenueCard({ venue, priority = false, aiConfidence, showUrgency = true }: VenueCardProps) {
  // Progressive disclosure - load additional data lazily
  const [isInView, setIsInView] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Simulate lazy loading of reviews/AI badge
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowDetails(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Simulate random view count for demo (in production, this would come from API)
  useEffect(() => {
    if (showUrgency) {
      const frame = requestAnimationFrame(() => {
        setViewCount(Math.floor(Math.random() * 15) + 3);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [showUrgency]);

  // Calculate urgency indicators
  const urgencyData = useMemo(
    () => buildUrgencyData(venue),
    [venue]
  );

  // Get first image or fallback
  const coverImage = venue.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1 }}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true, margin: '-50px' }}
    >
      <Link href={`/venues/${venue.id}`}>
        <Card interactive padding="none" className="overflow-hidden group relative h-full">
          {/* Image - Tier 1: Loads immediately */}
          <div className="relative h-40 sm:h-48 bg-divider overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={venue.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={priority}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-soft to-blush flex items-center justify-center">
                <span className="text-4xl">🏛️</span>
              </div>
            )}
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className={cn(
                'absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 rounded-full glass',
                'transition-all hover:scale-110 z-10',
                isFavorite && 'text-rani bg-white'
              )}
            >
              <Heart 
                className={cn('w-4 h-4 sm:w-5 sm:h-5', isFavorite && 'fill-current')} 
              />
            </button>

            {/* Top Left Badges Stack */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
              {/* Verified Vendor */}
              {venue.vendor?.status === 'APPROVED' && (
                <div className="px-2 py-1 bg-white/90 text-charcoal text-[10px] sm:text-xs rounded-full font-semibold flex items-center gap-1 shadow-sm">
                  <BadgeCheck className="w-3 h-3 text-success" />
                  Verified
                </div>
              )}

              {/* Amenity Badge */}
              {venue.amenities?.includes('Vegetarian') && (
                <div className="px-2 py-1 bg-success text-white text-[10px] sm:text-xs rounded-full font-semibold shadow-sm">
                  Pure Veg
                </div>
              )}
              
              {/* New Badge */}
              {showUrgency && urgencyData.isNew && (
                <div className="px-2 py-1 bg-gradient-to-r from-info to-blue-600 text-white text-[10px] sm:text-xs rounded-full font-semibold flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3" />
                  New
                </div>
              )}

              {/* Discount Badge */}
              {showUrgency && urgencyData.hasDiscount && (
                <div className="px-2 py-1 bg-gradient-to-r from-rani to-gold text-white text-[10px] sm:text-xs rounded-full font-semibold shadow-sm">
                  {urgencyData.discountPercent}% Off
                </div>
              )}
            </div>

            {/* Popular/Trending Badge */}
            {showUrgency && urgencyData.isPopular && !urgencyData.isNew && (
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs rounded-full font-semibold flex items-center gap-1 z-10 shadow-sm">
                <TrendingUp className="w-3 h-3" />
                Popular
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4">
            {/* Tier 1: Name + Price - Loads immediately */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-serif font-semibold text-base sm:text-lg text-charcoal line-clamp-2">
                {venue.name}
              </h3>
              <div className="text-right shrink-0">
                <p className="text-rani font-bold text-sm sm:text-base whitespace-nowrap">
                  {formatCurrency(venue.pricePerPlate)}
                  <span className="text-[10px] sm:text-xs text-muted font-normal">/plate</span>
                </p>
              </div>
            </div>

            {/* Tier 2: Location + Capacity */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted mb-2.5 sm:mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{venue.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Up to {venue.capacity}</span>
              </div>
            </div>

            {/* Tier 3: Reviews + AI Badge - Lazy loaded */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold fill-gold" />
                  <span className="text-xs sm:text-sm font-semibold">
                    {venue.rating?.toFixed(1) ?? '4.8'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted">
                    ({venue.reviewCount || 0})
                  </span>
                </div>
                
                {aiConfidence && (
                  <AIBadge confidence={aiConfidence} />
                )}
              </motion.div>
            )}

            {/* Urgency Indicators */}
            {showUrgency && showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-divider/50"
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  {/* Limited Dates Warning */}
                  {urgencyData.datesLeft <= 5 && (
                    <div className="flex items-center gap-1 text-error font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>Only {urgencyData.datesLeft} dates left!</span>
                    </div>
                  )}
                  
                  {/* View Count */}
                  {viewCount > 0 && (
                    <div className="flex items-center gap-1 text-muted ml-auto">
                      <Eye className="w-3 h-3" />
                      <span>{viewCount} viewing now</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Premium hover glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-rani/10 via-transparent to-transparent" />
        </Card>
      </Link>
    </motion.div>
  );
}
