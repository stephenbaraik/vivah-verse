'use client';

import { useRouter } from 'next/navigation';
import { useWeddingDateStore, getWeddingDateParam } from '@/stores/wedding-date-store';
import {
  HeroSection,
  TrustBadges,
  FeaturedVenues,
  HowItWorks,
  Testimonials,
  DatePickerSection,
  AIConcierCta,
  PopularDestinations,
} from '@/components/home';

export default function HomePage() {
  const router = useRouter();
  const { setDateSelection } = useWeddingDateStore();

  const handleStartPlanning = () => {
    const element = document.getElementById('planning-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreVenues = () => {
    router.push('/venues');
  };

  const handleFindVenues = (date: Date, guests?: number, city?: string) => {
    setDateSelection(date, guests, city);

    const dateParam = getWeddingDateParam(date);
    const params = new URLSearchParams();
    if (dateParam) params.set('date', dateParam);
    if (guests) params.set('guests', guests.toString());
    if (city) params.set('city', city);

    router.push(`/venues?${params.toString()}`);
  };

  return (
    <div className="space-y-0">
      {/* Hero with Video/Image Carousel */}
      <HeroSection
        onStartPlanning={handleStartPlanning}
        onExploreVenues={handleExploreVenues}
      />

      {/* Trust Badges / Stats */}
      <TrustBadges />

      {/* Featured Venues Carousel */}
      <FeaturedVenues />

      {/* How It Works */}
      <HowItWorks />

      {/* Date Picker Section (Original Wizard) */}
      <DatePickerSection onFindVenues={handleFindVenues} />

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Testimonials */}
      <Testimonials />

      {/* AI Concierge CTA */}
      <AIConcierCta />
    </div>
  );
}
