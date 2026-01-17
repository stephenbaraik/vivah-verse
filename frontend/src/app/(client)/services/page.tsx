'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Palette, UtensilsCrossed, Camera, Music, Flower2, Car, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui';

const SERVICES = [
  {
    id: 'decor',
    title: 'Decor & Design',
    description: 'Transform your venue into a magical wonderland with our expert decorators. From traditional mandaps to contemporary themes.',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    vendors: 45,
    color: 'from-rani to-rani/70',
  },
  {
    id: 'catering',
    title: 'Catering & Cuisine',
    description: 'Delight your guests with exquisite cuisines. From traditional Indian to international fare, our caterers do it all.',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
    vendors: 62,
    color: 'from-gold to-gold/70',
  },
  {
    id: 'photography',
    title: 'Photography & Video',
    description: 'Capture every precious moment with award-winning photographers and cinematographers who specialize in weddings.',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80',
    vendors: 78,
    color: 'from-info to-info/70',
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    description: 'Keep your guests entertained with DJs, live bands, traditional performers, and choreographers.',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    vendors: 34,
    color: 'from-success to-success/70',
  },
  {
    id: 'florals',
    title: 'Florals & Mehendi',
    description: 'Beautiful floral arrangements and traditional mehendi artists to add color and tradition to your celebration.',
    icon: Flower2,
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=600&q=80',
    vendors: 28,
    color: 'from-rani to-gold',
  },
  {
    id: 'transport',
    title: 'Transport & Logistics',
    description: 'Luxury cars, decorated baraats, guest transportation, and complete event logistics management.',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80',
    vendors: 19,
    color: 'from-charcoal to-charcoal/70',
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rani to-gold mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
            Wedding Services
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            From decor to catering, photography to entertainment — find trusted vendors 
            who will make your wedding day unforgettable.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/services/${service.id}`}>
              <Card interactive padding="none" className="overflow-hidden group h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-charcoal">
                    {service.vendors} vendors
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-semibold text-xl text-charcoal mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-rani font-medium text-sm group-hover:gap-2 transition-all">
                    Explore Vendors
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-rose-soft to-blush/30 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-charcoal mb-4">
            Why Choose Our Vendors?
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Every vendor on our platform is carefully vetted to ensure quality and reliability.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Verified Vendors', desc: 'All vendors are verified and reviewed' },
            { title: 'Transparent Pricing', desc: 'No hidden costs, clear quotes' },
            { title: 'Quality Assured', desc: 'Only top-rated professionals' },
            { title: 'Easy Booking', desc: 'Simple booking and payment' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-rani/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-rani" />
              </div>
              <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-serif font-semibold text-charcoal mb-4">
          Are You a Wedding Vendor?
        </h2>
        <p className="text-muted mb-6">
          Join India&apos;s fastest-growing wedding platform and connect with thousands of couples.
        </p>
        <Link href="/vendor/onboarding">
          <button className="px-8 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-charcoal/90 transition-colors">
            List Your Business
          </button>
        </Link>
      </section>
    </div>
  );
}
