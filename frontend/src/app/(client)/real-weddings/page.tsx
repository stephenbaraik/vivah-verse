'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Heart, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

// Sample real weddings data
const REAL_WEDDINGS = [
  {
    id: '1',
    couple: 'Priya & Rahul',
    location: 'Udaipur',
    venue: 'The Grand Palace',
    date: 'December 2025',
    guests: 350,
    style: 'Royal Heritage',
    budget: '₹25-30 Lakhs',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80',
      'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    ],
    story: 'Priya and Rahul chose the majestic Grand Palace in Udaipur for their royal-themed wedding. The three-day celebration included a lakeside mehendi, a grand sangeet under the stars, and a traditional ceremony overlooking the Aravalli hills.',
    featured: true,
  },
  {
    id: '2',
    couple: 'Sneha & Arjun',
    location: 'Goa',
    venue: 'Seaside Paradise Resort',
    date: 'November 2025',
    guests: 150,
    style: 'Beach Wedding',
    budget: '₹18-22 Lakhs',
    coverImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    ],
    story: 'An intimate beach wedding with their closest friends and family. The sunset ceremony on the pristine sands of Goa was followed by a bohemian-chic reception with fairy lights and bonfire.',
    featured: true,
  },
  {
    id: '3',
    couple: 'Ananya & Vikram',
    location: 'Jaipur',
    venue: 'Royal Garden Estate',
    date: 'October 2025',
    guests: 500,
    style: 'Traditional Rajasthani',
    budget: '₹35-40 Lakhs',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1200&q=80',
    ],
    story: 'A grand celebration of Rajasthani culture and traditions. The wedding featured folk dancers, a baraat with elephants, and a spectacular fireworks display.',
    featured: false,
  },
  {
    id: '4',
    couple: 'Kavya & Rohan',
    location: 'Kerala',
    venue: 'Backwater Bliss',
    date: 'September 2025',
    guests: 100,
    style: 'South Indian Traditional',
    budget: '₹12-15 Lakhs',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    ],
    story: 'A serene Kerala wedding on the backwaters. Traditional Kasavu sarees, banana leaf feast, and a ceremony on a decorated houseboat made this wedding truly unique.',
    featured: true,
  },
  {
    id: '5',
    couple: 'Meera & Aditya',
    location: 'Mumbai',
    venue: 'The Leela Mumbai',
    date: 'August 2025',
    guests: 400,
    style: 'Contemporary Glamour',
    budget: '₹45-50 Lakhs',
    coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80',
      'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1200&q=80',
    ],
    story: 'A glamorous Mumbai wedding that combined traditional values with contemporary style. Celebrity performances, designer decor, and a luxury reception that guests are still talking about.',
    featured: false,
  },
  {
    id: '6',
    couple: 'Tara & Dev',
    location: 'Delhi',
    venue: 'The Imperial',
    date: 'July 2025',
    guests: 600,
    style: 'Grand Celebration',
    budget: '₹60-70 Lakhs',
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    ],
    story: 'A five-day extravaganza in the heart of Delhi. From poolside cocktails to a Bollywood-themed sangeet and a traditional ceremony, every moment was picture-perfect.',
    featured: false,
  },
];

const STYLES = ['All', 'Beach Wedding', 'Royal Heritage', 'Traditional', 'Contemporary', 'Intimate'];

export default function RealWeddingsPage() {
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedWedding, setSelectedWedding] = useState<typeof REAL_WEDDINGS[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredWeddings = selectedStyle === 'All'
    ? REAL_WEDDINGS
    : REAL_WEDDINGS.filter((w) => w.style.toLowerCase().includes(selectedStyle.toLowerCase()));

  const openLightbox = (wedding: typeof REAL_WEDDINGS[0], index = 0) => {
    setSelectedWedding(wedding);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedWedding(null);
    setLightboxIndex(0);
  };

  const nextImage = () => {
    if (selectedWedding) {
      setLightboxIndex((prev) => (prev + 1) % selectedWedding.images.length);
    }
  };

  const prevImage = () => {
    if (selectedWedding) {
      setLightboxIndex((prev) => (prev - 1 + selectedWedding.images.length) % selectedWedding.images.length);
    }
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative full-bleed -mt-6 h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rani to-gold mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Real Weddings
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Get inspired by beautiful weddings curated through Vivah Verse. 
              Real love stories, real celebrations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-8">
        {/* Style Filters */}
        <section className="flex flex-wrap justify-center gap-3">
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-all',
              selectedStyle === style
                ? 'bg-rani text-white'
                : 'bg-white border border-divider text-charcoal hover:border-rani'
            )}
          >
            {style}
          </button>
        ))}
      </section>

      {/* Featured Weddings */}
      <section>
        <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">
          Featured Love Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {filteredWeddings.filter((w) => w.featured).map((wedding, index) => (
            <motion.div
              key={wedding.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card interactive padding="none" className="overflow-hidden group">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={wedding.coverImage}
                    alt={wedding.couple}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 text-gold text-sm mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-gold/20 backdrop-blur-sm">
                        {wedding.style}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-2">{wedding.couple}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {wedding.venue}, {wedding.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {wedding.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {wedding.guests} guests
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-muted mb-4 line-clamp-2">{wedding.story}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-charcoal font-medium">
                      Budget: {wedding.budget}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openLightbox(wedding)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      View Gallery
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Weddings Grid */}
      <section>
        <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">
          More Love Stories
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeddings.filter((w) => !w.featured).map((wedding, index) => (
            <motion.div
              key={wedding.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                interactive
                padding="none"
                className="overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(wedding)}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={wedding.coverImage}
                    alt={wedding.couple}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-charcoal">
                    {wedding.style}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-charcoal mb-1">
                    {wedding.couple}
                  </h3>
                  <p className="text-sm text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {wedding.location} • {wedding.date}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-rose-soft to-blush/30 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-charcoal mb-4">
          Ready to Create Your Love Story?
        </h2>
        <p className="text-muted max-w-2xl mx-auto mb-6">
          Let us help you plan the wedding of your dreams. Explore our venues and start your journey today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg">Start Planning</Button>
          </Link>
          <Link href="/venues">
            <Button variant="secondary" size="lg">Explore Venues</Button>
          </Link>
        </div>
      </section>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedWedding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-[4/3] rounded-xl overflow-hidden"
            >
              <Image
                src={selectedWedding.images[lightboxIndex]}
                alt={selectedWedding.couple}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Info Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
              <p className="font-serif font-semibold text-lg">{selectedWedding.couple}</p>
              <p className="text-sm text-white/70">
                {selectedWedding.venue}, {selectedWedding.location}
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {selectedWedding.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      idx === lightboxIndex ? 'bg-white w-6' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
