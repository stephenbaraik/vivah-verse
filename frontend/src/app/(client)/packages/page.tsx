'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Star, Heart, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Stepper,
  Input,
} from '@/components/ui';
import { AIExplainer } from '@/components/ai';
import { ServiceOption, PriceSummary } from '@/components/packages';
import { usePackageStore, calculatePackageTotal } from '@/stores/package-store';
import { formatCurrency, cn } from '@/lib/utils';
import type { PackageItem, PackageCategory } from '@/types/package';

// Pre-made package tiers
const PACKAGE_TIERS = [
  {
    id: 'budget',
    name: 'Essential',
    tagline: 'Perfect for intimate celebrations',
    icon: Heart,
    color: 'from-success to-success/70',
    priceRange: '₹8 - 12 Lakhs',
    guestRange: '50-150 guests',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    includes: [
      'Budget-friendly venue',
      'Basic floral decor',
      'Vegetarian catering (10 dishes)',
      'Photography (8 hours)',
      'Basic sound & DJ',
    ],
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Most popular choice for dream weddings',
    icon: Star,
    color: 'from-rani to-rani/70',
    priceRange: '₹18 - 30 Lakhs',
    guestRange: '150-400 guests',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    includes: [
      'Premium venue of choice',
      'Royal floral decor with lighting',
      'Multi-cuisine catering (15+ dishes)',
      'Photography + Videography',
      'Professional DJ & entertainment',
      'Mehendi artist',
      'Bridal makeup',
    ],
    recommended: true,
  },
  {
    id: 'luxury',
    name: 'Luxury',
    tagline: 'For the grandest celebrations',
    icon: Crown,
    color: 'from-gold to-gold/70',
    priceRange: '₹40 - 80+ Lakhs',
    guestRange: '400-1000+ guests',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    includes: [
      'Heritage palace/5-star venue',
      'Designer decor & installations',
      'Luxury multi-cuisine with live counters',
      'Cinematic photography & videography',
      'Celebrity DJ & performers',
      'Complete bridal & groom styling',
      'Destination wedding coordination',
      'Guest accommodation management',
    ],
    recommended: false,
  },
];

const STEPS = [
  { id: 'venue', label: 'Venue' },
  { id: 'services', label: 'Services' },
  { id: 'catering', label: 'Catering' },
  { id: 'review', label: 'Review' },
];

// Service options data
const DECOR_OPTIONS: PackageItem[] = [
  { id: 'd1', name: 'Elegant Floral Decor', description: 'Classic floral arrangements & stage', price: 150000 },
  { id: 'd2', name: 'Royal Palace Decor', description: 'Grand royal theme with lighting', price: 300000 },
  { id: 'd3', name: 'Modern Minimalist', description: 'Clean, contemporary aesthetic', price: 120000 },
];

const CATERING_OPTIONS: PackageItem[] = [
  { id: 'c1', name: 'Premium Veg Catering', description: '10+ course vegetarian menu', price: 250000 },
  { id: 'c2', name: 'Luxury Multi-Cuisine', description: '15+ courses with live counters', price: 450000 },
  { id: 'c3', name: 'Royal Rajasthani Feast', description: 'Traditional Rajasthani cuisine', price: 350000 },
];

const ADDITIONAL_SERVICES: (PackageItem & { category: PackageCategory })[] = [
  { id: 'p1', name: 'Photography', description: 'Full day coverage + album', price: 100000, category: 'photography' },
  { id: 'v1', name: 'Videography', description: 'Cinematic wedding film', price: 80000, category: 'videography' },
  { id: 'dj1', name: 'DJ & Sound', description: 'Professional DJ with lighting', price: 50000, category: 'dj' },
  { id: 'm1', name: 'Mehendi Artist', description: 'For bride & family', price: 25000, category: 'mehendi' },
  { id: 'mk1', name: 'Bridal Makeup', description: 'Professional bridal makeup', price: 35000, category: 'makeup' },
];

function PackageBuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTierFromUrl = useMemo(() => {
    const tierParam = searchParams.get('tier');
    if (tierParam === 'budget' || tierParam === 'premium' || tierParam === 'luxury') return tierParam;
    return null;
  }, [searchParams]);

  const [showBuilder, setShowBuilder] = useState(() => Boolean(initialTierFromUrl));
  const [selectedTier, setSelectedTier] = useState<string | null>(() => initialTierFromUrl);
  const {
    selection,
    guestCount,
    budget,
    setItem,
    removeItem,
    setGuestCount,
    setBudget,
  } = usePackageStore();

  useEffect(() => {
    const guestsParam = searchParams.get('guests');
    if (guestsParam) {
      const g = parseInt(guestsParam, 10);
      if (!Number.isNaN(g) && g > 0) setGuestCount(g);
    }

    const budgetParam = searchParams.get('budget');
    if (budgetParam) {
      const b = parseInt(budgetParam, 10);
      if (!Number.isNaN(b) && b > 0) setBudget(b);
    }
  }, [searchParams, setBudget, setGuestCount]);

  const total = useMemo(
    () => calculatePackageTotal(selection, guestCount),
    [selection, guestCount]
  );

  const isOverBudget = total > budget;

  // Toggle service selection
  const toggleService = (category: PackageCategory, item: PackageItem) => {
    if (selection[category]?.id === item.id) {
      removeItem(category);
    } else {
      setItem(category, item);
    }
  };

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setShowBuilder(true);
  };

  const handleCustomBuild = () => {
    setSelectedTier(null);
    setShowBuilder(true);
  };

  // AI suggestions when over budget
  const budgetSuggestions = useMemo(() => {
    if (!isOverBudget) return [];
    const suggestions: string[] = [];

    if (guestCount > 300) {
      const savings = (guestCount - 300) * (selection.venue?.price ?? 2500);
      suggestions.push(`Reduce guest count by ${guestCount - 300} to save ${formatCurrency(savings)}`);
    }

    if (selection.decor?.id === 'd2') {
      suggestions.push('Choose Elegant Floral instead of Royal Palace decor to save ₹1,50,000');
    }

    if (selection.catering?.id === 'c2') {
      suggestions.push('Consider Premium Veg Catering to save ₹2,00,000');
    }

    if (selection.photography && selection.videography) {
      suggestions.push('Ask for a photo + video combo package for potential ₹30,000 savings');
    }

    if (suggestions.length === 0) {
      suggestions.push('Consider adjusting your budget or removing optional services');
    }

    return suggestions;
  }, [isOverBudget, selection, guestCount]);

  const handleContinue = () => {
    // Navigate to booking with package selection
    router.push('/booking');
  };

  // If not showing builder, show package selection
  if (!showBuilder) {
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
              Wedding Packages
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Choose a pre-designed package or build your own custom wedding experience
            </p>
          </motion.div>
        </section>

        {/* Package Tiers */}
        <section className="grid md:grid-cols-3 gap-8">
          {PACKAGE_TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-rani text-white text-xs font-medium rounded-full z-10">
                  Most Popular
                </div>
              )}
              <Card
                className={cn(
                  'h-full overflow-hidden',
                  tier.recommended && 'ring-2 ring-rani'
                )}
              >
                {/* Image Header */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={tier.image}
                    alt={tier.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} mb-2`}>
                      <tier.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-white">{tier.name}</h3>
                    <p className="text-sm text-white/80">{tier.tagline}</p>
                  </div>
                </div>

                <CardContent className="pt-6">
                  {/* Price */}
                  <div className="text-center mb-6 pb-6 border-b border-divider">
                    <p className="text-2xl font-bold text-charcoal">{tier.priceRange}</p>
                    <p className="text-sm text-muted">{tier.guestRange}</p>
                  </div>

                  {/* Includes */}
                  <ul className="space-y-3 mb-6">
                    {tier.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-charcoal">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectTier(tier.id)}
                    className="w-full"
                    variant={tier.recommended ? 'primary' : 'secondary'}
                  >
                    Choose {tier.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Custom Build CTA */}
        <section className="text-center">
          <p className="text-muted mb-4">
            Want more control? Build a completely custom package.
          </p>
          <Button
            variant="secondary"
            onClick={handleCustomBuild}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Build Custom Package
          </Button>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-semibold text-charcoal text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Can I customize a pre-made package?', a: 'Yes! Each package is a starting point. You can add or remove services as needed.' },
              { q: 'Are venue costs included?', a: 'Package prices include venue rental. Specific venue pricing may vary based on your choice.' },
              { q: 'What\'s the booking process?', a: 'Select a package, choose your venue and date, make a deposit, and our team will handle the rest.' },
              { q: 'Can I pay in installments?', a: 'Yes, we offer flexible payment plans. Typically 30% booking, 40% before, 30% after.' },
            ].map((faq, idx) => (
              <details key={idx} className="group bg-white/50 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-[var(--shadow-glass)]">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-charcoal">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-muted group-open:hidden" />
                  <ChevronUp className="w-5 h-5 text-muted hidden group-open:block" />
                </summary>
                <div className="px-5 pb-5 text-muted">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Builder View
  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* Back to Packages Button */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <button
          onClick={() => setShowBuilder(false)}
          className="text-sm text-muted hover:text-charcoal flex items-center gap-1"
        >
          ← Back to Packages
        </button>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-semibold text-charcoal mb-2">
            {selectedTier
              ? `Customize Your ${PACKAGE_TIERS.find(t => t.id === selectedTier)?.name} Package`
              : 'Build Your Wedding Package'
            }
          </h1>
          <p className="text-muted">
            Customize your perfect wedding with transparent pricing
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto">
          <Stepper steps={STEPS} currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Venue Summary (if selected) */}
            {selection.venue && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Venue</CardTitle>
                    <span className="text-sm text-success flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Selected
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-rani/30 to-gold/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🏛️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-charcoal">{selection.venue.name}</h3>
                      <p className="text-sm text-muted">{selection.venue.description}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted">Guests:</span>
                          <Input
                            type="number"
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value) || 100)}
                            className="w-24"
                          />
                        </div>
                        <span className="text-gold font-semibold">
                          {formatCurrency(selection.venue.price)}/plate
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget Input */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-charcoal mb-1 block">
                      Your Budget
                    </label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value) || 500000)}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-muted">
                    We&apos;ll help you stay within your budget
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Decor Section */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Decor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DECOR_OPTIONS.map((opt) => (
                  <ServiceOption
                    key={opt.id}
                    item={opt}
                    selected={selection.decor?.id === opt.id}
                    onSelect={() => toggleService('decor', opt)}
                  />
                ))}
              </div>
            </section>

            {/* Catering Section */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">🍽️</span>
                Catering
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATERING_OPTIONS.map((opt) => (
                  <ServiceOption
                    key={opt.id}
                    item={opt}
                    selected={selection.catering?.id === opt.id}
                    onSelect={() => toggleService('catering', opt)}
                  />
                ))}
              </div>
            </section>

            {/* Additional Services */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span>
                Additional Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADDITIONAL_SERVICES.map((opt) => (
                  <ServiceOption
                    key={opt.id}
                    item={opt}
                    selected={selection[opt.category]?.id === opt.id}
                    onSelect={() => toggleService(opt.category, opt)}
                  />
                ))}
              </div>
            </section>

            {/* AI Suggestions when over budget */}
            {isOverBudget && budgetSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AIExplainer
                  title="Budget optimization suggestions"
                  reasons={budgetSuggestions}
                  editable
                />
              </motion.div>
            )}
          </div>

          {/* Price Summary - Sticky Sidebar */}
          <PriceSummary
            onContinue={handleContinue}
            continueLabel="Continue to Booking"
          />
        </div>
      </div>
    </div>
  );
}

export default function PackageBuilderPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" />}>
      <PackageBuilderInner />
    </Suspense>
  );
}
