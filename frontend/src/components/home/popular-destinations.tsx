'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DESTINATIONS = [
  {
    city: 'Udaipur',
    tagline: 'City of Lakes',
    venues: 12,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  },
  {
    city: 'Jaipur',
    tagline: 'Royal Heritage',
    venues: 15,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
  },
  {
    city: 'Goa',
    tagline: 'Beach Paradise',
    venues: 10,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
  },
  {
    city: 'Kerala',
    tagline: 'Backwater Bliss',
    venues: 8,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
  },
  {
    city: 'Mumbai',
    tagline: 'Urban Elegance',
    venues: 18,
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80',
  },
  {
    city: 'Delhi',
    tagline: 'Grand Celebrations',
    venues: 20,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
  },
];

export function PopularDestinations() {
  return (
    <section className="section bg-gradient-to-b from-white via-rose-soft/30 to-rose-soft">
      <div className="container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs sm:text-sm font-semibold text-rani uppercase tracking-wider mb-2">
            Explore Destinations
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-charcoal mb-3">
            Popular Wedding Destinations
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
            From royal palaces in Rajasthan to serene beaches in Goa, discover India&apos;s most romantic wedding destinations
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link href={`/venues?city=${dest.city}`}>
                <div className="group relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm shadow-charcoal/10">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
                    <h3 className="font-serif font-semibold text-white text-base sm:text-lg">
                      {dest.city}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm">{dest.tagline}</p>
                    <p className="text-[10px] sm:text-xs text-gold mt-0.5 sm:mt-1 font-medium">{dest.venues} venues</p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link
            href="/venues/collections"
            className="inline-flex items-center gap-2 text-rani font-semibold text-sm sm:text-base hover:gap-3 transition-all"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
