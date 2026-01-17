'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NoVenuesFoundProps {
  onClearFilters?: () => void;
  onAskAI?: () => void;
  className?: string;
}

/**
 * Empty state for venue search with AI fallback
 */
export function NoVenuesFound({
  onClearFilters,
  onAskAI,
  className,
}: NoVenuesFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-rose-soft flex items-center justify-center mb-6">
        <MapPin className="w-10 h-10 text-rani" />
      </div>
      
      <h3 className="text-xl font-semibold font-serif text-charcoal mb-2">
        No venues available on this date
      </h3>
      
      <p className="text-muted max-w-md mb-8">
        Try adjusting your date or location, or let our AI concierge help you find 
        alternatives that match your preferences.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onClearFilters && (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        
        {onAskAI && (
          <Button 
            onClick={onAskAI}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Ask AI for Alternatives
          </Button>
        )}
      </div>
    </motion.div>
  );
}
