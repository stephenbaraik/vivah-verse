'use client';

import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Users, Award, Calendar } from 'lucide-react';

const STATS = [
  {
    icon: Heart,
    value: '500+',
    label: 'Happy Couples',
    color: 'text-rani',
    bg: 'bg-rani/10',
  },
  {
    icon: MapPin,
    value: '75+',
    label: 'Premium Venues',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Star,
    value: '4.9',
    label: 'Average Rating',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Guests Served',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Award,
    value: '15+',
    label: 'Cities Covered',
    color: 'text-rani',
    bg: 'bg-rani/10',
  },
  {
    icon: Calendar,
    value: '8+',
    label: 'Years Experience',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
];

export function TrustBadges() {
  return (
    <section className="full-bleed py-10 sm:py-12 bg-white/35 backdrop-blur-2xl border-y border-white/35">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <p className="mx-auto w-fit text-sm font-semibold text-rani uppercase tracking-widest mb-2 text-center">
            Trusted by Thousands
          </p>
          <h2 className="font-serif font-semibold text-charcoal">
            India&apos;s Most Loved Wedding Platform
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="text-center p-4 sm:p-5 rounded-2xl hover:bg-rose-soft/50 transition-colors"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.bg} mb-3 shadow-sm`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-10 pt-8 border-t border-divider"
        >
          <p className="text-center text-sm text-muted mb-4">Featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-40 grayscale hover:opacity-60 transition-opacity">
            <div className="text-lg sm:text-2xl font-serif font-bold text-charcoal">Times of India</div>
            <div className="text-lg sm:text-2xl font-serif font-bold text-charcoal">Vogue</div>
            <div className="text-lg sm:text-2xl font-serif font-bold text-charcoal hidden sm:block">Harper&apos;s Bazaar</div>
            <div className="text-lg sm:text-2xl font-serif font-bold text-charcoal">Elle</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
