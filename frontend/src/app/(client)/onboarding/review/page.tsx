'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Users, 
  MapPin, 
  Wallet, 
  Sparkles, 
  Check,
  Loader2,
  Edit2
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useCreateWedding } from '@/features/wedding';
import { useAuthStore } from '@/stores/auth-store';
import { AuthModal } from '@/components/auth';
import OnboardingLayout from '../layout-client';

const BUDGET_LABELS: Record<string, string> = {
  'under-10L': 'Under ₹10 Lakh',
  '10L-25L': '₹10-25 Lakh',
  '25L-50L': '₹25-50 Lakh',
  '50L-1Cr': '₹50 Lakh - 1 Crore',
  'above-1Cr': 'Above ₹1 Crore',
};

const STYLE_LABELS: Record<string, { label: string; emoji: string }> = {
  'traditional': { label: 'Traditional', emoji: '🪔' },
  'modern': { label: 'Modern', emoji: '✨' },
  'fusion': { label: 'Fusion', emoji: '🎭' },
  'destination': { label: 'Destination', emoji: '🏝️' },
  'intimate': { label: 'Intimate', emoji: '💕' },
};

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  editPath?: string;
}

function SummaryRow({ icon, label, value, editPath }: SummaryRowProps) {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-divider last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="font-medium text-charcoal">{value}</p>
        </div>
      </div>
      {editPath && (
        <button 
          onClick={() => router.push(editPath)}
          className="p-2 text-muted hover:text-rani transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function OnboardingReviewPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const createWedding = useCreateWedding();
  const { 
    weddingDate,
    isMultiDay,
    brideName,
    groomName,
    guestCount,
    city,
    budgetRange,
    weddingStyle,
    completedSteps,
    getWeddingData,
    resetOnboarding
  } = useOnboardingStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if previous steps not completed
  useEffect(() => {
    if (!completedSteps.includes(3)) {
      router.push('/onboarding/preferences');
    }
  }, [completedSteps, router]);

  const handleBack = () => {
    router.push('/onboarding/preferences');
  };

  const handleSubmit = async () => {
    // Check auth first
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const weddingData = getWeddingData();
    if (!weddingData) return;

    setIsSubmitting(true);
    
    try {
      await createWedding.mutateAsync(weddingData);
      // Reset onboarding state after successful creation
      resetOnboarding();
      // Router push is handled in useCreateWedding hook
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Retry submission after auth
    handleSubmit();
  };

  const formattedDate = weddingDate?.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <OnboardingLayout currentStep={4}>
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-rose-soft flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-rani" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">
          Review your details
        </h1>
        <p className="text-muted text-lg">
          Make sure everything looks perfect
        </p>
      </motion.div>

      {/* Couple Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="text-center bg-gradient-to-r from-rose-soft to-champagne">
          <p className="text-sm text-muted mb-2">Celebrating the wedding of</p>
          <h2 className="text-2xl font-serif font-semibold text-charcoal">
            {brideName} <span className="text-rani">&</span> {groomName}
          </h2>
        </Card>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <Card>
          <SummaryRow
            icon={<Calendar className="w-4 h-4 text-rani" />}
            label="Wedding Date"
            value={
              <span>
                {formattedDate}
                {isMultiDay && <span className="text-xs text-muted ml-2">(Multi-day)</span>}
              </span>
            }
            editPath="/onboarding"
          />
          <SummaryRow
            icon={<Heart className="w-4 h-4 text-rani" />}
            label="Couple"
            value={`${brideName} & ${groomName}`}
            editPath="/onboarding/couple"
          />
          <SummaryRow
            icon={<Users className="w-4 h-4 text-rani" />}
            label="Guest Count"
            value={`${guestCount?.toLocaleString()} guests`}
            editPath="/onboarding/preferences"
          />
          <SummaryRow
            icon={<MapPin className="w-4 h-4 text-rani" />}
            label="City"
            value={city}
            editPath="/onboarding/preferences"
          />
          <SummaryRow
            icon={<Wallet className="w-4 h-4 text-rani" />}
            label="Budget"
            value={budgetRange ? BUDGET_LABELS[budgetRange] : '-'}
            editPath="/onboarding/preferences"
          />
          <SummaryRow
            icon={<Sparkles className="w-4 h-4 text-rani" />}
            label="Style"
            value={
              weddingStyle ? (
                <span className="flex items-center gap-2">
                  {STYLE_LABELS[weddingStyle].emoji} {STYLE_LABELS[weddingStyle].label}
                </span>
              ) : '-'
            }
            editPath="/onboarding/preferences"
          />
        </Card>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card variant="accent">
          <h3 className="font-medium text-charcoal mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span>We&apos;ll save your wedding details</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span>Show you venues matching your preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span>Our AI concierge will help you plan everything</span>
            </li>
          </ul>
        </Card>
      </motion.div>

      {/* Submit button - sticky on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-divider md:relative md:p-0 md:bg-transparent md:border-0">
        <Button
          fullWidth
          size="lg"
          disabled={isSubmitting || createWedding.isPending}
          onClick={handleSubmit}
        >
          {isSubmitting || createWedding.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating your wedding...
            </>
          ) : (
            'Start Planning'
          )}
        </Button>
        {!isAuthenticated && (
          <p className="text-xs text-muted text-center mt-2">
            You&apos;ll need to sign in to save your wedding
          </p>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        contextMessage="Sign in to save your wedding details and start planning"
      />
    </OnboardingLayout>
  );
}
