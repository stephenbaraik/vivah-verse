'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  X, 
  Check,
  FileText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  ChevronRight,
  Download
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent,
  StatusBadge,
  Skeleton,
  EmptyState,
} from '@/components/ui';
import { AdminService } from '@/services/admin.service';
import { formatDate } from '@/lib/utils';
import type { PendingVendor } from '@/types/api';

const TABS = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export default function VendorApprovalPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<PendingVendor | null>(null);
  const [notes, setNotes] = useState('');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['pending-vendors'],
    queryFn: () => AdminService.getPendingVendors(),
  });

  const mutation = useMutation({
    mutationFn: ({
      vendorId,
      status,
      reason,
    }: {
      vendorId: string;
      status: 'APPROVED' | 'REJECTED';
      reason?: string;
    }) => AdminService.updateVendorStatus(vendorId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setSelectedVendor(null);
      setNotes('');
    },
  });

  const handleApprove = () => {
    if (!selectedVendor) return;
    mutation.mutate({
      vendorId: selectedVendor.id,
      status: 'APPROVED',
    });
  };

  const handleReject = () => {
    if (!selectedVendor) return;
    mutation.mutate({
      vendorId: selectedVendor.id,
      status: 'REJECTED',
      reason: notes || undefined,
    });
  };

  const filteredVendors = vendors.filter(v => 
    v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <Skeleton key={tab.id} className="h-10 w-32" />
          ))}
        </div>
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Main Table */}
      <div className={`flex-1 flex flex-col ${selectedVendor ? 'hidden lg:flex' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Vendor Approvals
          </h1>
          <Button variant="ghost" size="sm" className="text-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-rani text-white'
                  : 'text-muted hover:text-charcoal hover:bg-cream'
              }`}
            >
              {tab.label}
              {tab.id === 'pending' && vendors.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-cream'
                }`}>
                  {vendors.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-divider text-charcoal placeholder:text-muted focus:ring-2 focus:ring-rani/50 focus:border-rani transition-all"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 ? (
          <Card className="flex-1">
            <CardContent className="py-12">
              <EmptyState type="no-pending" />
            </CardContent>
          </Card>
        ) : (
          /* Table */
          <div className="flex-1 overflow-auto rounded-lg border border-divider bg-white">
            <table className="w-full">
              <thead className="bg-cream sticky top-0">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted">Business</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Applied</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Documents</th>
                  <th className="text-right p-4 text-sm font-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor, idx) => (
                  <motion.tr
                    key={vendor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-t border-divider hover:bg-cream/50 cursor-pointer transition-colors ${
                      selectedVendor?.id === vendor.id ? 'bg-cream' : ''
                    }`}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-charcoal">{vendor.businessName}</p>
                        <p className="text-sm text-muted">{vendor.contactPerson}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-charcoal">{vendor.city}{vendor.state && `, ${vendor.state}`}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-muted">{formatDate(vendor.createdAt)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {vendor.documents?.map((doc, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              doc.status === 'uploaded' || doc.status === 'verified' ? 'bg-success' : 'bg-warning'
                            }`}
                            title={`${doc.type}: ${doc.status}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <ChevronRight className="w-5 h-5 text-muted inline" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-96 bg-white rounded-xl border border-divider flex flex-col shadow-lg"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <h2 className="font-semibold text-charcoal">Vendor Details</h2>
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-2 rounded-lg hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-auto p-4 space-y-6">
              {/* Business Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rani/30 to-gold/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-rani" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{selectedVendor.businessName}</h3>
                    <p className="text-sm text-muted">{selectedVendor.contactPerson}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted" />
                    <span className="text-charcoal">{selectedVendor.city}{selectedVendor.state && `, ${selectedVendor.state}`}</span>
                  </div>
                  {selectedVendor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted" />
                      <span className="text-charcoal">{selectedVendor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted" />
                    <span className="text-charcoal">{selectedVendor.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-charcoal">Applied {formatDate(selectedVendor.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-medium text-charcoal mb-3">Documents</h4>
                <div className="space-y-2">
                  {selectedVendor.documents?.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-cream"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted" />
                        <span className="text-charcoal">{doc.type}</span>
                      </div>
                      {doc.status === 'uploaded' || doc.status === 'verified' ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status="approved" label="Uploaded" size="sm" />
                          {doc.url && (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded">
                              <Download className="w-4 h-4 text-muted" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <StatusBadge status="pending" label="Pending" size="sm" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium text-charcoal mb-3">Review Notes</h4>
                <textarea
                  placeholder="Add notes about this vendor..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cream border border-divider text-charcoal placeholder:text-muted focus:ring-2 focus:ring-rani/50 resize-none"
                />
              </div>
            </div>

            {/* Panel Actions */}
            <div className="p-4 border-t border-divider space-y-2">
              <Button
                fullWidth
                onClick={handleApprove}
                isLoading={mutation.isPending}
                leftIcon={!mutation.isPending && <Check className="w-4 h-4" />}
              >
                Approve Vendor
              </Button>
              <Button
                fullWidth
                variant="danger"
                onClick={handleReject}
                disabled={mutation.isPending}
                leftIcon={<X className="w-4 h-4" />}
              >
                Reject
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
