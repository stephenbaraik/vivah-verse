'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Clock, BookOpen, Tag } from 'lucide-react';
import { Card, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All',
  'Planning Tips',
  'Venue Guides',
  'Traditions',
  'Budget',
  'Decor Ideas',
  'Fashion',
];

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Complete Guide to Planning an Indian Wedding',
    excerpt: 'From mehendi to reception, here\'s everything you need to know about planning a traditional Indian wedding celebration.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    category: 'Planning Tips',
    author: 'Priya Sharma',
    date: 'Jan 5, 2026',
    readTime: '12 min read',
    featured: true,
  },
  {
    id: '2',
    title: 'Top 10 Royal Palace Venues in Rajasthan',
    excerpt: 'Discover the most stunning heritage palace venues perfect for a royal wedding celebration.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    category: 'Venue Guides',
    author: 'Rahul Verma',
    date: 'Jan 3, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: '3',
    title: 'Understanding Indian Wedding Traditions: A Deep Dive',
    excerpt: 'Explore the rich cultural significance behind various Indian wedding rituals and ceremonies.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    category: 'Traditions',
    author: 'Dr. Anjali Mehta',
    date: 'Dec 28, 2025',
    readTime: '15 min read',
    featured: false,
  },
  {
    id: '4',
    title: 'Wedding Budget Breakdown: Where to Splurge and Save',
    excerpt: 'Learn how to allocate your wedding budget wisely without compromising on quality.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    category: 'Budget',
    author: 'Vikram Singh',
    date: 'Dec 22, 2025',
    readTime: '10 min read',
    featured: false,
  },
  {
    id: '5',
    title: '2026 Wedding Decor Trends You Need to Know',
    excerpt: 'From sustainable florals to fusion themes, discover what\'s trending in wedding decor this year.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    category: 'Decor Ideas',
    author: 'Neha Kapoor',
    date: 'Dec 18, 2025',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: '6',
    title: 'Beach Wedding Guide: Planning Your Coastal Celebration',
    excerpt: 'Everything you need to know about hosting the perfect beach wedding in India.',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    category: 'Venue Guides',
    author: 'Arjun Nair',
    date: 'Dec 15, 2025',
    readTime: '9 min read',
    featured: false,
  },
  {
    id: '7',
    title: 'Bridal Lehenga Guide: Choosing Your Perfect Outfit',
    excerpt: 'Expert tips on selecting the perfect bridal lehenga based on your body type and wedding theme.',
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&q=80',
    category: 'Fashion',
    author: 'Kavya Reddy',
    date: 'Dec 10, 2025',
    readTime: '11 min read',
    featured: false,
  },
  {
    id: '8',
    title: 'Monsoon Weddings: Tips for a Rain-Proof Celebration',
    excerpt: 'Don\'t let the rain dampen your spirits. Here\'s how to plan a beautiful monsoon wedding.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    category: 'Planning Tips',
    author: 'Amit Patel',
    date: 'Dec 5, 2025',
    readTime: '6 min read',
    featured: false,
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rani to-gold mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
            Wedding Planning Blog
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Expert tips, inspiration, and guides to help you plan your perfect wedding day.
          </p>
        </motion.div>
      </section>

      {/* Search & Filter */}
      <section className="space-y-4">
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-muted" />}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-rani text-white'
                  : 'bg-white border border-divider text-charcoal hover:border-rani'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card interactive padding="none" className="overflow-hidden group h-full">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rani text-white text-xs font-medium">
                        Featured
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs mb-2">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                        <h3 className="font-serif font-bold text-xl text-white line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-muted text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">
          {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog/${post.id}`}>
                <Card interactive padding="none" className="overflow-hidden group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-charcoal">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-rani transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">No articles found</h3>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-br from-rani to-gold rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
          Get Wedding Planning Tips in Your Inbox
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-6">
          Subscribe to our newsletter for weekly tips, inspiration, and exclusive offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-charcoal"
          />
          <button className="px-6 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-charcoal/90 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}
