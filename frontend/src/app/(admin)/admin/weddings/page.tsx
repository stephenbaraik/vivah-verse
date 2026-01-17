'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  EmptyState,
  Skeleton,
  StatusBadge,
} from '@/components/ui';
import { AdminService } from '@/services/admin.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
} from 'lucide-react';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const statusMap: Record<string, { status: 'pending' | 'approved' | 'rejected'; label: string }> = {
  PLANNING: { status: 'pending', label: 'Planning' },
  CONFIRMED: { status: 'approved', label: 'Confirmed' },
  COMPLETED: { status: 'approved', label: 'Completed' },
  CANCELLED: { status: 'rejected', label: 'Cancelled' },
};

export default function AdminWeddingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-weddings'],
    queryFn: () => AdminService.getWeddings(),
  });

  const weddings = data?.weddings || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-charcoal">
          All Weddings
        </h1>
        <p className="text-muted mt-1">
          Monitor all weddings on the platform
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted">Total Weddings</p>
            <p className="text-2xl font-serif font-semibold text-charcoal">
              {data?.total || weddings.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted">In Planning</p>
            <p className="text-2xl font-serif font-semibold text-gold">
              {weddings.filter((w) => w.status === 'PLANNING').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted">Confirmed</p>
            <p className="text-2xl font-serif font-semibold text-success">
              {weddings.filter((w) => w.status === 'CONFIRMED').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted">Completed</p>
            <p className="text-2xl font-serif font-semibold text-charcoal">
              {weddings.filter((w) => w.status === 'COMPLETED').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weddings List */}
      {weddings.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState type="no-weddings" />
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="space-y-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {weddings.map((wedding) => {
            const statusInfo = statusMap[wedding.status] || statusMap.PLANNING;
            return (
              <motion.div key={wedding.id} variants={fadeIn}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusBadge
                            status={statusInfo.status}
                            label={statusInfo.label}
                            size="sm"
                          />
                          {wedding.clientEmail && (
                            <span className="text-sm text-muted">
                              {wedding.clientEmail}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-charcoal">
                            <Calendar className="w-4 h-4 text-muted" />
                            {formatDate(wedding.weddingDate)}
                          </span>
                          <span className="flex items-center gap-1 text-charcoal">
                            <MapPin className="w-4 h-4 text-muted" />
                            {wedding.city}
                          </span>
                          <span className="flex items-center gap-1 text-charcoal">
                            <Users className="w-4 h-4 text-muted" />
                            {wedding.guestCount} guests
                          </span>
                          {wedding.budget && (
                            <span className="flex items-center gap-1 text-charcoal">
                              <IndianRupee className="w-4 h-4 text-muted" />
                              {formatCurrency(wedding.budget)}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-muted">
                        Created {formatDate(wedding.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
