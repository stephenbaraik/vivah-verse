'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
} from '@/components/ui';
import { AlertTriangle, MessageSquare, RefreshCw, Scale } from 'lucide-react';

export default function AdminIssuesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-charcoal">
          Issues Queue
        </h1>
        <p className="text-muted mt-1">
          Customer and vendor issues requiring attention
        </p>
      </div>

      {/* Issue Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Open Issues</p>
                <p className="text-3xl font-serif font-semibold text-warning">
                  0
                </p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Refund Requests</p>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  0
                </p>
              </div>
              <div className="p-2 bg-cream rounded-lg">
                <RefreshCw className="w-5 h-5 text-rani" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Disputes</p>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  0
                </p>
              </div>
              <div className="p-2 bg-cream rounded-lg">
                <Scale className="w-5 h-5 text-rani" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Complaints</p>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  0
                </p>
              </div>
              <div className="p-2 bg-cream rounded-lg">
                <MessageSquare className="w-5 h-5 text-rani" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState type="all-caught-up" />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card variant="accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rani" />
            Issue Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">
            This queue will centralize all customer and vendor issues. The system
            is ready to handle:
          </p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Customer complaints about vendors or venues
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Refund requests and cancellation disputes
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Vendor-customer conflicts
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Payment and booking issues
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Quality and service complaints
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
