'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Mail,
  ChevronRight,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
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
import { AdminService } from '@/services/admin.service';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Vendors' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'REJECTED', label: 'Rejected' },
];

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

export default function AllVendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['all-vendors'],
    queryFn: () => AdminService.getPendingVendors(),
  });

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-gold" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            All Vendors
          </h1>
          <p className="text-muted mt-1">
            Manage and view all registered vendors
          </p>
        </div>
        <Link href="/admin/vendors/pending">
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Pending Approvals
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by business name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {STATUS_FILTERS.map((filter) => (
                <Button
                  key={filter.id}
                  variant={statusFilter === filter.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setStatusFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cream rounded-lg">
                <Users className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{vendors.length}</p>
                <p className="text-sm text-muted">Total Vendors</p>
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
                <p className="text-2xl font-semibold">
                  {vendors.filter((v) => v.status === 'APPROVED').length}
                </p>
                <p className="text-sm text-muted">Approved</p>
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
                <p className="text-2xl font-semibold">
                  {vendors.filter((v) => v.status === 'PENDING').length}
                </p>
                <p className="text-sm text-muted">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-error/10 rounded-lg">
                <XCircle className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {vendors.filter((v) => v.status === 'REJECTED').length}
                </p>
                <p className="text-sm text-muted">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredVendors.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No vendors found"
          description="Try adjusting your search or filter criteria"
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filteredVendors.map((vendor) => (
            <motion.div key={vendor.id} variants={fadeIn}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-charcoal truncate">
                          {vendor.businessName || 'Unnamed Business'}
                        </h3>
                        {getStatusIcon(vendor.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted">
                        {vendor.user?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {vendor.user.email}
                          </span>
                        )}
                        {vendor.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vendor.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={
                          vendor.status === 'APPROVED'
                            ? 'success'
                            : vendor.status === 'PENDING'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {vendor.status}
                      </StatusBadge>
                      <ChevronRight className="w-5 h-5 text-muted" />
                    </div>
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
