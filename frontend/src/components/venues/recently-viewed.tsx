'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChevronRight, MapPin } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

interface RecentlyViewedVenue {
  id: string;
  name: string;
  city: string;
  image: string;
  pricePerPlate: number;
  viewedAt: number;
}

const STORAGE_KEY = 'vivah-recently-viewed';
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedVenue[]>(() => {
    if (typeof window === 'undefined') return [];

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored) as RecentlyViewedVenue[];
      return parsed.filter(
        (item) => Date.now() - item.viewedAt < 24 * 60 * 60 * 1000
      );
    } catch (error) {
      console.error('Error parsing recently viewed:', error);
      return [];
    }
  });

  const addItem = (venue: Omit<RecentlyViewedVenue, 'viewedAt'>) => {
    setItems((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== venue.id);
      // Add to front with timestamp
      const updated = [{ ...venue, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearItems = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  };

  return { items, addItem, clearItems };
}

interface RecentlyViewedProps {
  className?: string;
}

export function RecentlyViewed({ className }: RecentlyViewedProps) {
  const { items, clearItems } = useRecentlyViewed();
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white rounded-xl border border-divider shadow-card overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-divider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted" />
          <h3 className="font-medium text-charcoal">Recently Viewed</h3>
          <span className="text-xs text-muted">({items.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearItems}
            className="text-xs text-muted hover:text-charcoal transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-rose-soft rounded-full transition-colors"
          >
            <ChevronRight
              className={cn(
                'w-4 h-4 text-muted transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        </div>
      </div>

      {/* Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {items.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/venues/${venue.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-rose-soft/50 transition-colors group"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-charcoal truncate group-hover:text-rani transition-colors">
                        {venue.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <MapPin className="w-3 h-3" />
                        <span>{venue.city}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-rani">
                        {formatCurrency(venue.pricePerPlate)}
                      </p>
                      <p className="text-xs text-muted">/plate</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="p-3 flex items-center gap-2 overflow-x-auto">
          {items.slice(0, 4).map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-rani transition-all"
            >
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                className="object-cover"
              />
            </Link>
          ))}
          {items.length > 4 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-12 h-12 rounded-lg bg-rose-soft flex items-center justify-center text-sm text-muted hover:text-charcoal transition-colors flex-shrink-0"
            >
              +{items.length - 4}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Floating version for bottom of screen
export function RecentlyViewedFloating() {
  const { items } = useRecentlyViewed();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (items.length > 0 && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [items.length, isDismissed]);

  if (!isVisible || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40"
    >
      <div className="bg-white rounded-xl shadow-modal border border-divider overflow-hidden">
        <div className="p-3 flex items-center justify-between border-b border-divider">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rani" />
            <span className="text-sm font-medium text-charcoal">Continue browsing</span>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-rose-soft rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>
        <div className="p-3 flex items-center gap-3 overflow-x-auto">
          {items.slice(0, 3).map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-rose-soft/50 hover:bg-rose-soft transition-colors flex-shrink-0"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal line-clamp-1 max-w-[120px]">
                  {venue.name}
                </p>
                <p className="text-xs text-rani">{formatCurrency(venue.pricePerPlate)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default RecentlyViewed;
