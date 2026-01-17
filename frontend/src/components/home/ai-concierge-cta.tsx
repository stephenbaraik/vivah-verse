'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export function AIConcierCta() {
  return (
    <section className="section-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container max-w-5xl relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-charcoal via-charcoal to-[#1A1A2E]"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-rani to-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-gold to-rani rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-16 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rani to-gold mb-4 sm:mb-6"
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 sm:mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-6 sm:mb-8">
            Our AI Wedding Concierge understands your preferences and helps you discover 
            the perfect venue. Just tell us what you&apos;re looking for!
          </p>

          {/* Sample Questions */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[
              'Beach wedding in Goa for 200 guests',
              'Royal heritage venue under ₹3000/plate',
              'Intimate garden wedding in Kerala',
            ].map((question, idx) => (
              <motion.div
                key={question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border border-white/10 text-xs sm:text-sm text-white/80"
              >
                &quot;{question}&quot;
              </motion.div>
            ))}
          </div>

          <Link href="/concierge">
            <Button
              size="lg"
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg"
              leftIcon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
              rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            >
              Chat with AI Concierge
            </Button>
          </Link>

          {/* Trust Note */}
          <p className="text-xs sm:text-sm text-white/50 mt-4 sm:mt-6">
            Powered by advanced AI • Available 24/7 • Instant recommendations
          </p>
        </div>
      </motion.div>
    </section>
  );
}
