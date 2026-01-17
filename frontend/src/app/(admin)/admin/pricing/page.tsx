'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';
import { IndianRupee, Percent, Tag, Calendar } from 'lucide-react';

export default function AdminPricingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-charcoal">
          Pricing Rules
        </h1>
        <p className="text-muted mt-1">
          Configure global pricing, commissions, and markups
        </p>
      </div>

      {/* Current Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Platform Commission</p>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  10%
                </p>
              </div>
              <div className="p-2 bg-cream rounded-lg">
                <Percent className="w-5 h-5 text-rani" />
              </div>
            </div>
            <p className="text-xs text-muted mt-2">
              Applied to all venue bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Service Markup</p>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  5%
                </p>
              </div>
              <div className="p-2 bg-cream rounded-lg">
                <Tag className="w-5 h-5 text-rani" />
              </div>
            </div>
            <p className="text-xs text-muted mt-2">
              Applied to vendor services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Peak Season Markup</p>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  15%
                </p>
              </div>
              <div className="p-2 bg-cream rounded-lg">
                <Calendar className="w-5 h-5 text-rani" />
              </div>
            </div>
            <p className="text-xs text-muted mt-2">
              Nov-Feb wedding season
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card variant="accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-rani" />
            Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">
            Global pricing rules and commissions will be configurable here. This
            foundation is ready for:
          </p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Commission percentage per vendor category
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Service-specific markups
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Seasonal pricing multipliers
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              Promotional discount rules
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rani" />
              City/region-based adjustments
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Placeholder Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-divider overflow-hidden">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted">
                    Rule Name
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted">
                    Value
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted">
                    Applies To
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-divider">
                  <td className="p-4 text-charcoal">Platform Commission</td>
                  <td className="p-4 text-muted">Commission</td>
                  <td className="p-4 text-charcoal font-medium">10%</td>
                  <td className="p-4 text-muted">All bookings</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-divider">
                  <td className="p-4 text-charcoal">Vendor Service Markup</td>
                  <td className="p-4 text-muted">Markup</td>
                  <td className="p-4 text-charcoal font-medium">5%</td>
                  <td className="p-4 text-muted">Vendor services</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-divider">
                  <td className="p-4 text-charcoal">Peak Season Premium</td>
                  <td className="p-4 text-muted">Markup</td>
                  <td className="p-4 text-charcoal font-medium">15%</td>
                  <td className="p-4 text-muted">Nov-Feb bookings</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
