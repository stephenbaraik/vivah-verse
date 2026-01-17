'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Pause, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    alt: 'Beautiful Indian wedding ceremony',
  },
  {
    url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1920&q=80',
    alt: 'Elegant wedding venue with flowers',
  },
  {
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80',
    alt: 'Couple at sunset wedding',
  },
  {
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&q=80',
    alt: 'Traditional wedding decorations',
  },
];

interface HeroSectionProps {
  onStartPlanning: () => void;
  onExploreVenues: () => void;
}

export function HeroSection({ onStartPlanning, onExploreVenues }: HeroSectionProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const scrollToPlanning = () => {
    const element = document.getElementById('planning-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[100dvh] min-h-[600px] max-h-[900px] full-bleed overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform-gpu"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentImage].url})` }}
          />
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-rani/20 via-transparent to-gold/20" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rani/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-3xl" />

      {/* Play/Pause Control */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-24 sm:bottom-28 right-4 sm:right-8 z-20 p-3 rounded-full glass hover:bg-white/30 transition-all"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              idx === currentImage ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
            )}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Decorative Element */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-rani to-gold mb-6 shadow-lg shadow-rani/30"
          >
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>

          <h1 className="font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
            Your Dream Wedding,{' '}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blush via-rani to-gold">
              Curated for You
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover stunning venues, connect with trusted vendors, and create memories that last forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg shadow-xl shadow-rani/30 hover:shadow-rani/40"
            >
              Start Planning Your Wedding
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onExploreVenues}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg glass border-white/30 text-white hover:bg-white/20"
            >
              Explore Venues
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToPlanning}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ 
            opacity: { delay: 1 },
            y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8" />
        </motion.button>
      </div>
    </section>
  );
}
