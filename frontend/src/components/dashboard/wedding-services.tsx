'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  UtensilsCrossed, 
  Sparkles, 
  Camera, 
  Music, 
  Car,
  Plus,
  Check,
  Clock,
  ChevronRight,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';
import type { Booking } from '@/types/api';

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'booked' | 'pending' | 'not-selected';
  booking?: Booking;
  href: string;
}

interface WeddingServicesProps {
  bookings?: Booking[];
  className?: string;
}

const SERVICE_ICONS = {
  venue: <Building2 className="w-5 h-5" />,
  catering: <UtensilsCrossed className="w-5 h-5" />,
  decor: <Sparkles className="w-5 h-5" />,
  photography: <Camera className="w-5 h-5" />,
  music: <Music className="w-5 h-5" />,
  transport: <Car className="w-5 h-5" />,
};

const STATUS_COLORS = {
  booked: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  'not-selected': 'bg-gray-100 text-gray-600 border-gray-200',
};

const STATUS_LABELS = {
  booked: 'Confirmed',
  pending: 'Pending',
  'not-selected': 'Not Selected',
};

export function WeddingServices({ bookings = [], className }: WeddingServicesProps) {
  const router = useRouter();
  // Find venue booking (first booking with venue)
  const venueBooking = bookings.find(b => b.venue);
  const venueStatus: ServiceItem['status'] = venueBooking 
    ? (venueBooking.status === 'CONFIRMED' ? 'booked' : 'pending')
    : 'not-selected';

  // Build services list
  const services: ServiceItem[] = [
    {
      id: 'venue',
      name: 'Venue',
      icon: SERVICE_ICONS.venue,
      status: venueStatus,
      booking: venueBooking,
      href: venueBooking ? `/booking/${venueBooking.id}` : '/venues',
    },
    {
      id: 'catering',
      name: 'Catering',
      icon: SERVICE_ICONS.catering,
      status: 'not-selected',
      href: '/vendors?category=catering',
    },
    {
      id: 'decor',
      name: 'Decor & Flowers',
      icon: SERVICE_ICONS.decor,
      status: 'not-selected',
      href: '/vendors?category=decor',
    },
    {
      id: 'photography',
      name: 'Photography',
      icon: SERVICE_ICONS.photography,
      status: 'not-selected',
      href: '/vendors?category=photography',
    },
    {
      id: 'music',
      name: 'Music & DJ',
      icon: SERVICE_ICONS.music,
      status: 'not-selected',
      href: '/vendors?category=music',
    },
    {
      id: 'transport',
      name: 'Transport',
      icon: SERVICE_ICONS.transport,
      status: 'not-selected',
      href: '/vendors?category=transport',
    },
  ];

  const bookedCount = services.filter(s => s.status === 'booked').length;
  const pendingCount = services.filter(s => s.status === 'pending').length;
  const totalServices = services.length;

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-serif font-semibold text-charcoal">
              Wedding Services
            </h3>
            <p className="text-sm text-muted mt-1">
              {bookedCount} of {totalServices} services booked
              {pendingCount > 0 && `, ${pendingCount} pending`}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
              <Check className="w-3 h-3 mr-1" />
              {bookedCount}
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                <Clock className="w-3 h-3 mr-1" />
                {pendingCount}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((bookedCount + pendingCount * 0.5) / totalServices) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-rani to-gold rounded-full"
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              role="link"
              tabIndex={0}
              onClick={() => router.push(service.href)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(service.href);
                }
              }}
              className={cn(
                'p-4 rounded-xl border-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
                service.status === 'booked'
                  ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                  : service.status === 'pending'
                    ? 'border-amber-200 bg-amber-50/50 hover:border-amber-300'
                    : 'border-gray-200 bg-white hover:border-rani/30 hover:bg-rose-soft/30'
              )}
            >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${service.status === 'booked' 
                      ? 'bg-green-100 text-green-600' 
                      : service.status === 'pending'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {service.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-charcoal">{service.name}</h4>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </div>

                    {service.booking?.venue ? (
                      <div className="mt-1">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {service.booking.venue.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {service.booking.venue.city}
                          </span>
                          {service.booking.venue.basePrice && (
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {formatCurrency(service.booking.venue.basePrice)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full border
                            ${STATUS_COLORS[service.status]}
                          `}>
                            {STATUS_LABELS[service.status]}
                          </span>
                          {service.status === 'pending' && service.booking && (
                            <Link 
                              href={`/payment?bookingId=${service.booking.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button size="sm" variant="primary" className="text-xs py-1 px-2 h-auto">
                                Pay Now
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <p className="text-sm text-muted flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Select {service.name.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
            </motion.div>
          ))}
        </div>

        {/* Browse all vendors */}
        <div className="mt-6 text-center">
          <Link href="/vendors">
            <Button variant="secondary" size="sm">
              Browse All Vendors
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
