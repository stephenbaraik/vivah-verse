'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Crown, Waves, TreePine, Building2, Mountain, Tent } from 'lucide-react';
import { Card } from '@/components/ui';

const COLLECTIONS = [
  {
    id: 'royal-palaces',
    title: 'Royal Palace Weddings',
    description: 'Experience the grandeur of royal heritage venues across Rajasthan and beyond',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    venueCount: 12,
    locations: ['Udaipur', 'Jaipur', 'Jodhpur'],
    priceRange: '₹3,000 - ₹6,000/plate',
    color: 'from-gold to-gold/70',
  },
  {
    id: 'beach-paradise',
    title: 'Beach Wedding Destinations',
    description: 'Say "I do" with the ocean as your backdrop at these stunning coastal venues',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    venueCount: 10,
    locations: ['Goa', 'Kerala', 'Mumbai'],
    priceRange: '₹2,500 - ₹4,500/plate',
    color: 'from-info to-info/70',
  },
  {
    id: 'garden-estates',
    title: 'Garden & Estate Weddings',
    description: 'Celebrate amidst lush gardens, manicured lawns, and natural beauty',
    icon: TreePine,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    venueCount: 18,
    locations: ['Bangalore', 'Pune', 'Chennai'],
    priceRange: '₹1,800 - ₹3,500/plate',
    color: 'from-success to-success/70',
  },
  {
    id: 'luxury-hotels',
    title: 'Luxury Hotel Venues',
    description: 'World-class hospitality and stunning ballrooms for the perfect celebration',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    venueCount: 25,
    locations: ['Mumbai', 'Delhi', 'Bangalore'],
    priceRange: '₹4,000 - ₹8,000/plate',
    color: 'from-rani to-rani/70',
  },
  {
    id: 'hill-stations',
    title: 'Hill Station Escapes',
    description: 'Intimate celebrations in the serene mountains and hill stations',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    venueCount: 8,
    locations: ['Shimla', 'Mussoorie', 'Ooty'],
    priceRange: '₹2,000 - ₹4,000/plate',
    color: 'from-charcoal to-charcoal/70',
  },
  {
    id: 'destination-resorts',
    title: 'Destination Resort Weddings',
    description: 'All-inclusive resort experiences for multi-day wedding celebrations',
    icon: Tent,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    venueCount: 15,
    locations: ['Maldives', 'Thailand', 'Bali'],
    priceRange: '₹5,000 - ₹12,000/plate',
    color: 'from-gold to-rani',
  },
];

const FEATURED_VENUES = [
  {
    id: '1',
    name: 'Taj Lake Palace',
    city: 'Udaipur',
    collection: 'Royal Palaces',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    price: '₹5,500/plate',
  },
  {
    id: '2',
    name: 'The Leela Goa',
    city: 'Goa',
    collection: 'Beach Paradise',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    price: '₹4,200/plate',
  },
  {
    id: '3',
    name: 'ITC Grand Bharat',
    city: 'Delhi',
    collection: 'Luxury Hotels',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    price: '₹6,800/plate',
  },
  {
    id: '4',
    name: 'Wildflower Hall',
    city: 'Shimla',
    collection: 'Hill Stations',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
    price: '₹3,800/plate',
  },
];

export default function VenueCollectionsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rani to-gold mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
            Curated Venue Collections
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Explore our handpicked collections of wedding venues, carefully curated 
            to match different styles, budgets, and dreams.
          </p>
        </motion.div>
      </section>

      {/* Collections Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/venues?collection=${collection.id}`}>
                <Card interactive padding="none" className="overflow-hidden group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${collection.color} flex items-center justify-center shadow-lg`}>
                      <collection.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Venue Count */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-charcoal">
                      {collection.venueCount} venues
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-serif font-bold text-xl text-white mb-1">
                        {collection.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin className="w-4 h-4" />
                        {collection.locations.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-muted text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">
                        {collection.priceRange}
                      </span>
                      <span className="inline-flex items-center gap-1 text-rani font-medium text-sm group-hover:gap-2 transition-all">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured from Collections */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-charcoal">
              Featured Venues
            </h2>
            <p className="text-muted">Top picks from our collections</p>
          </div>
          <Link href="/venues" className="text-rani font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_VENUES.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/venues/${venue.id}`}>
                <Card interactive padding="none" className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-rani/90 text-white text-xs font-medium">
                      {venue.collection}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-charcoal mb-1">{venue.name}</h3>
                    <p className="text-sm text-muted flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {venue.city}
                    </p>
                    <p className="text-sm text-rani font-medium">{venue.price}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal/90 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rani to-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Tell our AI Concierge your preferences and let us find the perfect venue for you.
          </p>
          <Link href="/concierge">
            <button className="px-8 py-3 bg-gradient-to-r from-rani to-gold text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Ask AI Concierge
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
