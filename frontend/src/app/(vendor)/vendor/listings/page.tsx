'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  MapPin,
  Users,
  IndianRupee,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Input,
  Button,
  StatusBadge,
  Skeleton,
  EmptyState,
} from '@/components/ui';
import { VenuesService } from '@/services/venues.service';
import { formatCurrency } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function VendorListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['vendor-venues'],
    queryFn: () => VenuesService.getMyVenues(),
  });

  const filteredListings = listings.filter((listing) =>
    listing.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === 'ACTIVE').length,
    pending: listings.filter((l) => l.status === 'PENDING').length,
    draft: listings.filter((l) => l.status === 'DRAFT').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            My Listings
          </h1>
          <p className="text-muted mt-1">
            Manage your venue listings and availability
          </p>
        </div>
        <Link href="/vendor/listings/edit">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Venue
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cream rounded-lg">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.total}</p>
                <p className="text-sm text-muted">Total Venues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.active}</p>
                <p className="text-sm text-muted">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.pending}</p>
                <p className="text-sm text-muted">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.draft}</p>
                <p className="text-sm text-muted">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search your venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 rounded-t-lg" />
              <CardContent className="py-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No venues yet"
          description="Start by adding your first venue listing"
          action={
            <Link href="/vendor/listings/edit">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Venue
              </Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredListings.map((listing) => (
            <motion.div key={listing.id} variants={fadeIn}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-neutral-100">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge
                      status={
                        listing.status === 'ACTIVE'
                          ? 'success'
                          : listing.status === 'PENDING'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {listing.status || 'Draft'}
                    </StatusBadge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="py-4">
                  <h3 className="font-medium text-charcoal truncate">
                    {listing.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{listing.city}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {listing.capacity} guests
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {formatCurrency(listing.pricePerPlate || 0)}/plate
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-divider">
                    <Link href={`/venues/${listing.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/vendor/listings/edit?id=${listing.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
