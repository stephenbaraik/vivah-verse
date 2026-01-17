'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, Input, Button } from '@/components/ui';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    value: '+91 12345 67890',
    description: 'Mon-Sat, 9am-7pm IST',
    action: 'tel:+911234567890',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@vivahverse.com',
    description: 'We reply within 24 hours',
    action: 'mailto:hello@vivahverse.com',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'Mumbai, Maharashtra',
    description: 'WeWork BKC, Level 5',
    action: '#',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    value: 'Chat with us',
    description: 'Available on the platform',
    action: '/concierge',
  },
];

const topics = [
  { id: 'general', label: 'General Inquiry', icon: HelpCircle },
  { id: 'venue', label: 'Venue Question', icon: Building2 },
  { id: 'booking', label: 'Booking Help', icon: Clock },
  { id: 'partnership', label: 'Partnership', icon: Building2 },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif font-semibold text-charcoal mb-4"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted max-w-xl mx-auto"
        >
          Have questions about venues, bookings, or partnerships? We&apos;re here to help make your wedding planning journey smooth and enjoyable.
        </motion.p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, index) => (
          <motion.a
            key={method.title}
            href={method.action}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto bg-rose-soft rounded-xl flex items-center justify-center mb-4">
                  <method.icon className="w-6 h-6 text-rani" />
                </div>
                <h3 className="font-medium text-charcoal">{method.title}</h3>
                <p className="text-rani font-medium mt-1">{method.value}</p>
                <p className="text-sm text-muted mt-1">{method.description}</p>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </div>

      {/* Contact Form & Map */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">Message Sent!</h3>
                  <p className="text-muted">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', topic: 'general', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-semibold text-charcoal mb-4">Send us a Message</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Your Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Phone Number (Optional)
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Topic
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, topic: topic.id })}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                            formData.topic === topic.id
                              ? 'border-rani bg-rose-soft text-rani'
                              : 'border-divider hover:border-rani/50'
                          }`}
                        >
                          <topic.icon className="w-4 h-4" />
                          <span className="text-sm">{topic.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-divider focus:border-rani focus:ring-2 focus:ring-rani/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Map / Office Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="overflow-hidden">
            <div className="aspect-video bg-neutral-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3542387645574!2d72.8654!3d19.0619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzQyLjgiTiA3MsKwNTEnNTUuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <CardContent className="py-4">
              <h3 className="font-medium text-charcoal">Vivah Verse HQ</h3>
              <p className="text-sm text-muted">WeWork BKC, Level 5, Bandra Kurla Complex, Mumbai 400051</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-charcoal mb-4">Business Hours</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Monday - Friday</span>
                  <span className="text-charcoal">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Saturday</span>
                  <span className="text-charcoal">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Sunday</span>
                  <span className="text-charcoal">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-charcoal mb-2">For Urgent Matters</h3>
              <p className="text-sm text-muted mb-4">
                For urgent booking issues or same-day support, please call our priority line.
              </p>
              <a href="tel:+911234567899" className="text-rani font-medium hover:underline">
                +91 12345 67899 (Priority)
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
