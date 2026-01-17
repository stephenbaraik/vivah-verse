'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Wallet, Sparkles } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { useOnboardingStore, type BudgetRange, type WeddingStyle } from '@/stores/onboarding-store';
import OnboardingLayout from '../layout-client';

const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Jaipur',
  'Udaipur',
  'Goa',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string; description: string }[] = [
  { value: 'under-10L', label: 'Under ₹10 Lakh', description: 'Intimate celebration' },
  { value: '10L-25L', label: '₹10-25 Lakh', description: 'Classic celebration' },
  { value: '25L-50L', label: '₹25-50 Lakh', description: 'Grand celebration' },
  { value: '50L-1Cr', label: '₹50 Lakh - 1 Crore', description: 'Lavish celebration' },
  { value: 'above-1Cr', label: 'Above ₹1 Crore', description: 'Royal celebration' },
];

const STYLE_OPTIONS: { value: WeddingStyle; label: string; emoji: string }[] = [
  { value: 'traditional', label: 'Traditional', emoji: '🪔' },
  { value: 'modern', label: 'Modern', emoji: '✨' },
  { value: 'fusion', label: 'Fusion', emoji: '🎭' },
  { value: 'destination', label: 'Destination', emoji: '🏝️' },
  { value: 'intimate', label: 'Intimate', emoji: '💕' },
];

export default function OnboardingPreferencesPage() {
  const router = useRouter();
  const { 
    guestCount: storedGuests,
    city: storedCity,
    budgetRange: storedBudget,
    weddingStyle: storedStyle,
    completedSteps,
    setPreferences 
  } = useOnboardingStore();
  
  const [guestCount, setGuestCount] = useState<number | ''>(storedGuests ?? '');
  const [city, setCity] = useState(storedCity);
  const [budgetRange, setBudgetRange] = useState<BudgetRange | null>(storedBudget);
  const [weddingStyle, setWeddingStyle] = useState<WeddingStyle | null>(storedStyle);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Redirect if previous steps not completed
  useEffect(() => {
    if (!completedSteps.includes(2)) {
      router.push('/onboarding/couple');
    }
  }, [completedSteps, router]);

  const isValid = 
    guestCount !== '' && 
    guestCount >= 50 && 
    city.length >= 2 && 
    budgetRange !== null && 
    weddingStyle !== null;

  const handleContinue = () => {
    if (!isValid || typeof guestCount !== 'number') return;
    setPreferences({
      guestCount,
      city,
      budgetRange: budgetRange!,
      weddingStyle: weddingStyle!,
    });
    router.push('/onboarding/review');
  };

  const handleBack = () => {
    router.push('/onboarding/couple');
  };

  const filteredCities = CITIES.filter(c => 
    c.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <OnboardingLayout currentStep={3}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-muted hover:text-charcoal mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">
          Your wedding preferences
        </h1>
        <p className="text-muted text-lg">
          Help us find the perfect venues for you
        </p>
      </motion.div>

      {/* Form */}
      <div className="space-y-6">
        {/* Guest Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-rani" />
              </div>
              <div className="flex-1">
                <label htmlFor="guests" className="block text-sm font-medium text-charcoal mb-2">
                  Expected number of guests
                </label>
                <Input
                  id="guests"
                  type="number"
                  placeholder="e.g., 300"
                  min={50}
                  max={5000}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value ? parseInt(e.target.value) : '')}
                />
                <p className="text-xs text-muted mt-1">Minimum 50 guests</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* City */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-rani" />
              </div>
              <div className="flex-1 relative">
                <label htmlFor="city" className="block text-sm font-medium text-charcoal mb-2">
                  Preferred city
                </label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Search city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setShowCityDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                />
                {/* City Dropdown */}
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-divider rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                    {filteredCities.map((c) => (
                      <button
                        key={c}
                        className="w-full px-4 py-2 text-left hover:bg-rose-soft text-charcoal"
                        onMouseDown={() => {
                          setCity(c);
                          setShowCityDropdown(false);
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Budget Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-rani" />
              </div>
              <div>
                <p className="font-medium text-charcoal">Budget range</p>
                <p className="text-sm text-muted">Select your approximate budget</p>
              </div>
            </div>
            <div className="grid gap-2">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBudgetRange(option.value)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 transition-all
                    ${budgetRange === option.value
                      ? 'border-rani bg-rose-soft'
                      : 'border-divider hover:border-muted'
                    }
                  `}
                >
                  <span className="font-medium text-charcoal">{option.label}</span>
                  <span className="text-sm text-muted">{option.description}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Wedding Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-rani" />
              </div>
              <div>
                <p className="font-medium text-charcoal">Wedding style</p>
                <p className="text-sm text-muted">What vibe are you going for?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWeddingStyle(option.value)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${weddingStyle === option.value
                      ? 'border-rani bg-rose-soft'
                      : 'border-divider hover:border-muted'
                    }
                  `}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm font-medium text-charcoal">{option.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Continue button - sticky on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-divider md:relative md:p-0 md:bg-transparent md:border-0 md:mt-6">
        <Button
          fullWidth
          size="lg"
          disabled={!isValid}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}
