'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui';

// Sample vendor data by category
const VENDORS_BY_CATEGORY: Record<string, {
  title: string;
  description: string;
  vendors: Array<{
    id: string;
    name: string;
    city: string;
    rating: number;
    reviews: number;
    startingPrice: string;
    image: string;
    specialties: string[];
    featured?: boolean;
  }>;
}> = {
  decor: {
    title: 'Decor & Design',
    description: 'Expert decorators who transform venues into magical spaces',
    vendors: [
      {
        id: '1',
        name: 'Dream Decor Studios',
        city: 'Mumbai',
        rating: 4.9,
        reviews: 156,
        startingPrice: '₹1.5 Lakhs',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
        specialties: ['Mandap Design', 'Floral Installations', 'Lighting'],
        featured: true,
      },
      {
        id: '2',
        name: 'Royal Events Decor',
        city: 'Delhi',
        rating: 4.8,
        reviews: 89,
        startingPrice: '₹2 Lakhs',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80',
        specialties: ['Traditional', 'Royal Themes', 'Stage Design'],
        featured: true,
      },
      {
        id: '3',
        name: 'Blossom Events',
        city: 'Jaipur',
        rating: 4.7,
        reviews: 67,
        startingPrice: '₹1.2 Lakhs',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
        specialties: ['Destination Weddings', 'Outdoor Decor'],
      },
    ],
  },
  catering: {
    title: 'Catering & Cuisine',
    description: 'Premium caterers offering diverse cuisines for your celebration',
    vendors: [
      {
        id: '1',
        name: 'Feast & Flavors',
        city: 'Mumbai',
        rating: 4.9,
        reviews: 234,
        startingPrice: '₹1,200/plate',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
        specialties: ['Multi-cuisine', 'Live Counters', 'Vegetarian'],
        featured: true,
      },
      {
        id: '2',
        name: 'Spice Route Caterers',
        city: 'Delhi',
        rating: 4.8,
        reviews: 178,
        startingPrice: '₹900/plate',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
        specialties: ['North Indian', 'Mughlai', 'Street Food'],
        featured: true,
      },
    ],
  },
  photography: {
    title: 'Photography & Video',
    description: 'Capture your special moments with the best wedding photographers',
    vendors: [
      {
        id: '1',
        name: 'Lens Stories',
        city: 'Mumbai',
        rating: 5.0,
        reviews: 312,
        startingPrice: '₹2.5 Lakhs',
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80',
        specialties: ['Candid', 'Cinematic Video', 'Drone'],
        featured: true,
      },
      {
        id: '2',
        name: 'Wedding Chronicles',
        city: 'Bangalore',
        rating: 4.9,
        reviews: 256,
        startingPrice: '₹1.8 Lakhs',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
        specialties: ['Documentary Style', 'Pre-wedding Shoots'],
        featured: true,
      },
    ],
  },
  entertainment: {
    title: 'Entertainment',
    description: 'DJs, bands, and performers to keep your guests entertained',
    vendors: [
      {
        id: '1',
        name: 'Beats & Vibes',
        city: 'Mumbai',
        rating: 4.8,
        reviews: 145,
        startingPrice: '₹75,000',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
        specialties: ['DJ', 'Live Band', 'Sound System'],
        featured: true,
      },
    ],
  },
  florals: {
    title: 'Florals & Mehendi',
    description: 'Beautiful floral arrangements and traditional mehendi artists',
    vendors: [
      {
        id: '1',
        name: 'Petal Perfect',
        city: 'Delhi',
        rating: 4.9,
        reviews: 98,
        startingPrice: '₹50,000',
        image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=600&q=80',
        specialties: ['Fresh Flowers', 'Garlands', 'Table Arrangements'],
        featured: true,
      },
    ],
  },
  transport: {
    title: 'Transport & Logistics',
    description: 'Luxury vehicles and complete event logistics',
    vendors: [
      {
        id: '1',
        name: 'Royal Rides',
        city: 'Jaipur',
        rating: 4.7,
        reviews: 67,
        startingPrice: '₹25,000/day',
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80',
        specialties: ['Vintage Cars', 'Luxury Fleet', 'Baraat'],
        featured: true,
      },
    ],
  },
};

export default function ServiceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const data = VENDORS_BY_CATEGORY[category];

  if (!data) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-serif text-charcoal mb-4">Category not found</h1>
        <Link href="/services">
          <Button>Back to Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <Link href="/services" className="inline-flex items-center gap-2 text-muted hover:text-charcoal mb-4">
          <ArrowLeft className="w-4 h-4" />
          All Services
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-2">
            {data.title}
          </h1>
          <p className="text-muted text-lg">
            {data.description}
          </p>
        </motion.div>
      </section>

      {/* Featured Vendors */}
      {data.vendors.filter((v) => v.featured).length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-charcoal mb-4">Featured Vendors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.vendors.filter((v) => v.featured).map((vendor, idx) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card interactive padding="none" className="overflow-hidden group">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                      <Image
                        src={vendor.image}
                        alt={vendor.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gold text-white text-xs rounded-full font-medium">
                        Featured
                      </div>
                    </div>
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif font-semibold text-lg text-charcoal">
                            {vendor.name}
                          </h3>
                          <p className="text-sm text-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vendor.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <span className="font-medium text-charcoal">{vendor.rating}</span>
                          <span className="text-muted">({vendor.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {vendor.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 bg-rose-soft text-rani text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">
                          Starting at <span className="font-semibold text-charcoal">{vendor.startingPrice}</span>
                        </p>
                        <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Vendors */}
      <section>
        <h2 className="text-xl font-semibold text-charcoal mb-4">All Vendors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.vendors.map((vendor, idx) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card interactive padding="none" className="overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="font-medium">{vendor.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-charcoal mb-1">{vendor.name}</h3>
                  <p className="text-sm text-muted flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    {vendor.city}
                  </p>
                  <p className="text-sm text-muted">
                    From <span className="font-semibold text-rani">{vendor.startingPrice}</span>
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-rani/10 to-gold/10 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-serif font-semibold text-charcoal mb-2">
          Need Help Choosing?
        </h2>
        <p className="text-muted mb-4">
          Our wedding experts can help you find the perfect vendor for your needs.
        </p>
        <Link href="/concierge">
          <Button>Talk to AI Concierge</Button>
        </Link>
      </section>
    </div>
  );
}
