'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { useOnboardingStore } from '@/stores/onboarding-store';
import OnboardingLayout from '../layout-client';

export default function OnboardingCouplePage() {
  const router = useRouter();
  const { 
    brideName: storedBride, 
    groomName: storedGroom, 
    completedSteps,
    setCoupleDetails 
  } = useOnboardingStore();
  
  const [brideName, setBrideName] = useState(storedBride);
  const [groomName, setGroomName] = useState(storedGroom);

  // Redirect if step 1 not completed
  useEffect(() => {
    if (!completedSteps.includes(1)) {
      router.push('/onboarding');
    }
  }, [completedSteps, router]);

  const isValid = brideName.trim().length >= 2 && groomName.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) return;
    setCoupleDetails(brideName.trim(), groomName.trim());
    router.push('/onboarding/preferences');
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  return (
    <OnboardingLayout currentStep={2}>
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
        <div className="w-16 h-16 rounded-full bg-rose-soft flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-rani" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">
          Tell us about the couple
        </h1>
        <p className="text-muted text-lg">
          We&apos;d love to know who&apos;s getting married
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="space-y-6">
          {/* Bride Name */}
          <div>
            <label htmlFor="brideName" className="block text-sm font-medium text-charcoal mb-2">
              Bride&apos;s Name
            </label>
            <Input
              id="brideName"
              type="text"
              placeholder="Enter bride's name"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Groom Name */}
          <div>
            <label htmlFor="groomName" className="block text-sm font-medium text-charcoal mb-2">
              Groom&apos;s Name
            </label>
            <Input
              id="groomName"
              type="text"
              placeholder="Enter groom's name"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Couple Preview */}
          {brideName && groomName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-4 border-t border-divider text-center"
            >
              <p className="text-muted text-sm mb-2">Your wedding</p>
              <p className="text-xl font-serif font-semibold text-charcoal">
                {brideName.trim()} <span className="text-rani">&</span> {groomName.trim()}
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>

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
