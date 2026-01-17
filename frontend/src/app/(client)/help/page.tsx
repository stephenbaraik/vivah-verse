'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  CreditCard,
  Calendar,
  MapPin,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Star,
} from 'lucide-react';
import { Card, CardContent, Input } from '@/components/ui';

const categories = [
  {
    id: 'getting-started',
    icon: Book,
    title: 'Getting Started',
    description: 'New to Vivah Verse? Start here',
    articles: [
      { title: 'How to create an account', slug: 'create-account' },
      { title: 'Finding your perfect venue', slug: 'finding-venues' },
      { title: 'Understanding venue pricing', slug: 'venue-pricing' },
      { title: 'Using the AI Concierge', slug: 'ai-concierge' },
    ],
  },
  {
    id: 'bookings',
    icon: Calendar,
    title: 'Bookings & Reservations',
    description: 'Everything about booking venues',
    articles: [
      { title: 'How to book a venue', slug: 'booking-process' },
      { title: 'Booking confirmation process', slug: 'booking-confirmation' },
      { title: 'Modifying your booking', slug: 'modify-booking' },
      { title: 'Cancellation and refund policy', slug: 'cancellation-policy' },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Payments & Billing',
    description: 'Payment methods and invoices',
    articles: [
      { title: 'Accepted payment methods', slug: 'payment-methods' },
      { title: 'Understanding your invoice', slug: 'invoice-details' },
      { title: 'Payment schedule and milestones', slug: 'payment-schedule' },
      { title: 'Requesting a refund', slug: 'refund-request' },
    ],
  },
  {
    id: 'venues',
    icon: MapPin,
    title: 'Venues & Services',
    description: 'Venue features and amenities',
    articles: [
      { title: 'What\'s included in venue pricing', slug: 'pricing-inclusions' },
      { title: 'Venue capacity and layouts', slug: 'venue-capacity' },
      { title: 'Food and catering options', slug: 'catering-options' },
      { title: 'Decoration and setup', slug: 'decoration-setup' },
    ],
  },
  {
    id: 'account',
    icon: Users,
    title: 'Account & Profile',
    description: 'Manage your account settings',
    articles: [
      { title: 'Updating your profile', slug: 'update-profile' },
      { title: 'Password and security', slug: 'password-security' },
      { title: 'Notification preferences', slug: 'notifications' },
      { title: 'Deleting your account', slug: 'delete-account' },
    ],
  },
  {
    id: 'vendors',
    icon: Star,
    title: 'For Vendors',
    description: 'Guide for venue partners',
    articles: [
      { title: 'How to list your venue', slug: 'list-venue' },
      { title: 'Managing bookings', slug: 'manage-bookings' },
      { title: 'Updating availability', slug: 'update-availability' },
      { title: 'Payout and earnings', slug: 'vendor-payouts' },
    ],
  },
];

const faqs = [
  {
    question: 'How do I book a venue?',
    answer: 'Browse venues on our platform, select your preferred date and check availability, then proceed with the booking request. The venue will confirm your booking within 24-48 hours.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and wallets. Payment is processed securely through our payment partner Razorpay.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking according to our cancellation policy. Refund amount depends on how far in advance you cancel. Check the specific venue\'s cancellation terms.',
  },
  {
    question: 'How does the AI Concierge work?',
    answer: 'Our AI Concierge understands your wedding requirements and suggests venues that match your preferences, budget, guest count, and preferred dates including auspicious muhurat dates.',
  },
  {
    question: 'Are the prices shown final?',
    answer: 'Prices shown are indicative and based on the selected guest count. Final pricing will be confirmed by the venue after reviewing your specific requirements.',
  },
  {
    question: 'How do I become a venue partner?',
    answer: 'Click on "List Your Venue" in the navigation menu, complete the registration form, and our team will review your application within 3-5 business days.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif font-semibold text-charcoal mb-4"
        >
          Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted max-w-xl mx-auto mb-8"
        >
          Find answers to common questions or get in touch with our support team.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="pl-12 py-6 text-lg"
            />
          </div>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-soft rounded-lg flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-5 h-5 text-rani" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">{category.title}</h3>
                    <p className="text-sm text-muted mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.articles.slice(0, 3).map((article) => (
                        <li key={article.slug}>
                          <Link
                            href={`/help/${category.id}/${article.slug}`}
                            className="text-sm text-charcoal hover:text-rani transition-colors flex items-center gap-1"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {category.articles.length > 3 && (
                      <Link
                        href={`/help/${category.id}`}
                        className="text-sm text-rani hover:underline mt-3 inline-block"
                      >
                        View all {category.articles.length} articles
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-serif font-semibold text-charcoal text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-charcoal">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-muted">{faq.answer}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-cream rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2">
            Still need help?
          </h2>
          <p className="text-muted">
            Our support team is available to assist you with any questions.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Link href="/concierge">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <MessageCircle className="w-8 h-8 text-rani mx-auto mb-3" />
                <h3 className="font-medium text-charcoal">AI Chat</h3>
                <p className="text-sm text-muted">Get instant answers</p>
              </CardContent>
            </Card>
          </Link>
          <a href="mailto:support@vivahverse.com">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 text-rani mx-auto mb-3" />
                <h3 className="font-medium text-charcoal">Email Us</h3>
                <p className="text-sm text-muted">support@vivahverse.com</p>
              </CardContent>
            </Card>
          </a>
          <a href="tel:+911234567890">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <Phone className="w-8 h-8 text-rani mx-auto mb-3" />
                <h3 className="font-medium text-charcoal">Call Us</h3>
                <p className="text-sm text-muted">+91 12345 67890</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>
    </div>
  );
}
