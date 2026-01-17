'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Venue } from '@/types/api';

interface VenueHeroProps {
  venue: Venue;
  onFavorite?: (isFavorite: boolean) => void;
}

/**
 * Hero image carousel for venue detail page
 */
export function VenueHero({ venue, onFavorite }: VenueHeroProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const images = venue.images?.length > 0 ? venue.images : [];
  const hasImages = images.length > 0;

  const handlePrev = () => {
    setCurrentImage((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setCurrentImage((i) => Math.min(images.length - 1, i + 1));
  };

  const handleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onFavorite?.(newValue);
  };

  return (
    <div className="relative h-[320px] md:h-[400px] bg-charcoal overflow-hidden rounded-xl">
      {/* Image or Placeholder */}
      {hasImages ? (
        <Image
          src={images[currentImage]}
          alt={`${venue.name} - Image ${currentImage + 1}`}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rani/30 to-gold/30 flex items-center justify-center">
          <span className="text-8xl">🏛️</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Navigation arrows */}
      {hasImages && images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentImage === 0}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg transition-opacity',
              currentImage === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentImage === images.length - 1}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg transition-opacity',
              currentImage === images.length - 1 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {hasImages && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i === currentImage ? 'bg-white' : 'bg-white/50'
              )}
            />
          ))}
        </div>
      )}

      {/* Back button */}
      <Link
        href="/venues"
        className="absolute top-4 left-4 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {/* Favorite button */}
      <button
        onClick={handleFavorite}
        className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <Heart
          className={cn(
            'w-5 h-5 transition-colors',
            isFavorite ? 'fill-rani text-rani' : 'text-charcoal'
          )}
        />
      </button>

      {/* Verified badge */}
      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-sm opacity-90 flex items-center gap-1">
          <span className="w-2 h-2 bg-success rounded-full" />
          Verified Venue
        </p>
      </div>
    </div>
  );
}
