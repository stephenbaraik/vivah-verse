'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const TESTIMONIALS = [
  {
    id: 1,
    couple: 'Priya & Rahul',
    location: 'Mumbai',
    date: 'December 2025',
    venue: 'The Grand Palace, Udaipur',
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&q=80',
    quote: 'Vivah Verse made our dream wedding a reality! From finding the perfect venue to coordinating with vendors, everything was seamless. The AI concierge was incredibly helpful in narrowing down our choices.',
    rating: 5,
  },
  {
    id: 2,
    couple: 'Sneha & Arjun',
    location: 'Bangalore',
    date: 'November 2025',
    venue: 'Seaside Paradise, Goa',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    quote: 'We wanted a destination wedding and were overwhelmed with options. Vivah Verse\'s curated collections and transparent pricing made the decision easy. Our guests are still talking about it!',
    rating: 5,
  },
  {
    id: 3,
    couple: 'Ananya & Vikram',
    location: 'Delhi',
    date: 'October 2025',
    venue: 'Royal Garden Estate, Jaipur',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80',
    quote: 'The heritage venue we booked through Vivah Verse exceeded all expectations. The team\'s attention to detail and the seamless booking process made planning stress-free. Highly recommend!',
    rating: 5,
  },
  {
    id: 4,
    couple: 'Kavya & Rohan',
    location: 'Chennai',
    date: 'September 2025',
    venue: 'Backwater Bliss, Kerala',
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400&q=80',
    quote: 'We found our dream venue within minutes of using the platform. The virtual tours and detailed amenity lists helped us make an informed decision without multiple site visits.',
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="section-sm bg-white overflow-hidden">
      <div className="container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs sm:text-sm font-semibold text-rani uppercase tracking-wider mb-2">
            Love Stories
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-charcoal mb-3">
            What Our Couples Say
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Real stories from couples who celebrated their love with Vivah Verse
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-16 z-10 p-2 sm:p-3 rounded-full glass hover:bg-white transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-16 z-10 p-2 sm:p-3 rounded-full glass hover:bg-white transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-rose-soft via-blush/30 to-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm shadow-charcoal/5 border border-divider/30"
            >
              <div className="grid md:grid-cols-5 gap-5 sm:gap-8 items-center">
                {/* Image */}
                <div className="md:col-span-2">
                  <div className="relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.couple}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay with couple info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-3 sm:p-4">
                      <p className="font-serif font-semibold text-white text-base sm:text-lg">
                        {testimonial.couple}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {testimonial.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {testimonial.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                  <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-rani/30 mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg md:text-xl text-charcoal leading-relaxed mb-4 sm:mb-6">
                    {testimonial.quote}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4 sm:w-5 sm:h-5',
                          i < testimonial.rating ? 'text-gold fill-gold' : 'text-divider'
                        )}
                      />
                    ))}
                  </div>

                  {/* Venue */}
                  <p className="text-xs sm:text-sm text-muted">
                    Celebrated at <span className="font-semibold text-charcoal">{testimonial.venue}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  idx === current ? 'bg-rani w-6 sm:w-8' : 'bg-divider/50 hover:bg-muted w-2'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
