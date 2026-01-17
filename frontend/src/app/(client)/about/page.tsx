'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Users,
  Sparkles,
  Target,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';

const stats = [
  { value: '10,000+', label: 'Happy Couples' },
  { value: '500+', label: 'Premium Venues' },
  { value: '50+', label: 'Cities Covered' },
  { value: '4.9', label: 'Average Rating' },
];

const values = [
  {
    icon: Heart,
    title: 'Love-Centered',
    description: 'Every decision we make is guided by our desire to help couples celebrate their love story.',
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'We partner only with venues and vendors that meet our high standards of quality and service.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in building lasting relationships with couples, vendors, and communities we serve.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Using AI and technology to make wedding planning easier, smarter, and more enjoyable.',
  },
];

const team = [
  { name: 'Krish Dhilliwal', role: 'Founder & CEO', image: '/team/krish.jpg' },
  { name: 'Aarav Pillay', role: 'Co- Founder & Head of Partnerships', image: '/team/aarav.jpg' },
  { name: 'Tanisha Ghosh', role: 'Co-Founder & Head of Creatives', image: '/team/tanisha.jpg' },
  { name: 'Stephen Baraik', role: 'CTO', image: '/team/stephen.png' },
  { name: 'Sneha Das', role: 'Head of Partnerships', image: '/team/sneha.jpg' },
  { name: 'Anam Shaikh', role: 'Head of Partnerships', image: '/team/anam.jpg' },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal mb-6">
            About <span className="text-rani">Vivah Verse</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            We&apos;re on a mission to transform how Indian weddings are planned. 
            By combining technology with tradition, we help couples find their perfect 
            venues and create celebrations that reflect their unique love story.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="py-6">
                <p className="text-3xl md:text-4xl font-serif font-bold text-rani">{stat.value}</p>
                <p className="text-muted mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Our Story */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif font-semibold text-charcoal mb-6">Our Story</h2>
          <div className="space-y-4 text-muted">
            <p>
              Vivah Verse was born from a simple observation: planning an Indian wedding 
              shouldn&apos;t be overwhelming. Founder Priya Sharma experienced firsthand the 
              challenges of finding the right venue—endless phone calls, scattered information, 
              and no easy way to compare options.
            </p>
            <p>
              In 2024, she assembled a team of technologists, wedding planners, and design 
              experts to create a platform that makes venue discovery delightful. Today, 
              Vivah Verse helps thousands of couples across India find venues that match 
              their vision, budget, and guest count.
            </p>
            <p>
              Our AI-powered concierge service goes beyond simple search—it understands 
              your preferences, considers auspicious dates, and provides personalized 
              recommendations that feel like they came from a trusted friend.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden relative">
            <Image 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800" 
              alt="Indian wedding celebration"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rani/10 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-rani" />
              </div>
              <div>
                <p className="font-medium text-charcoal">Trusted Platform</p>
                <p className="text-sm text-muted">Since 2024</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-3xl font-serif font-semibold text-charcoal text-center mb-10">
          Our Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-rose-soft rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-rani" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">{value.title}</h3>
                  <p className="text-muted text-sm">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-3xl font-serif font-semibold text-charcoal text-center mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center w-full max-w-[240px]"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                <Image 
                  src={member.image} 
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 60vw, 240px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-charcoal">{member.name}</h3>
              <p className="text-sm text-muted">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-rani to-rani/80 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-serif font-semibold mb-4">
          Ready to Find Your Perfect Venue?
        </h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">
          Join thousands of couples who have found their dream wedding venue through Vivah Verse.
        </p>
        <Link href="/venues">
          <Button variant="secondary" size="lg">
            Explore Venues
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
