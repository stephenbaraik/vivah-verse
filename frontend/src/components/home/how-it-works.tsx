'use client';

import { motion } from 'framer-motion';
import { Calendar, Search, PartyPopper, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Calendar,
    title: 'Select Your Date',
    description: 'Choose your wedding date and we\'ll show you venues available on that day. Check auspicious dates with our built-in calendar.',
    color: 'from-rani to-rani/70',
    step: 1,
  },
  {
    icon: Search,
    title: 'Browse Venues',
    description: 'Explore stunning venues across India. Use filters, compare options, and let our AI concierge help you find the perfect match.',
    color: 'from-gold to-gold/70',
    step: 2,
  },
  {
    icon: PartyPopper,
    title: 'Book & Celebrate',
    description: 'Secure your venue with easy payments, manage your bookings, and let us handle the details while you focus on your special day.',
    color: 'from-success to-success/70',
    step: 3,
  },
];

export function HowItWorks() {
  return (
    <section className="section bg-gradient-to-br from-rose-soft via-blush/30 to-white">
      <div className="container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs sm:text-sm font-semibold text-rani uppercase tracking-wider mb-2">
            Simple & Seamless
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-charcoal mb-3">
            How It Works
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Planning your dream wedding has never been easier. Follow these three simple steps
            and we&apos;ll take care of the rest.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-rani via-gold to-success" />
          
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center bg-white rounded-2xl p-4 sm:p-6 shadow-sm shadow-charcoal/5 border border-divider/30"
            >
              {/* Step Number */}
              <div className="relative z-10 mx-auto mb-4 sm:mb-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                  <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                {/* Step badge */}
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md flex items-center justify-center text-xs sm:text-sm font-bold text-charcoal border border-divider/30">
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-serif font-semibold text-charcoal mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Arrow (between steps on mobile) */}
              {index < STEPS.length - 1 && (
                <div className="sm:hidden flex justify-center mt-4">
                  <ArrowRight className="w-5 h-5 text-rani/50 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
