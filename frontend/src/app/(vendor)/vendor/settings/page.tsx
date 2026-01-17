'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Bell,
  CreditCard,
  Shield,
  Save,
  Camera,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
} from '@/components/ui';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function VendorSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Settings
          </h1>
          <p className="text-muted mt-1">
            Manage your account and business preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-divider overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-rani text-rani'
                  : 'border-transparent text-muted hover:text-charcoal'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-cream flex items-center justify-center">
                      <User className="w-16 h-16 text-gold" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-rani text-white rounded-full hover:bg-rani/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted mt-4">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Full Name
                    </label>
                    <Input defaultValue="Vendor Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Email
                    </label>
                    <Input type="email" defaultValue="vendor@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Phone
                    </label>
                    <Input type="tel" defaultValue="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Location
                    </label>
                    <Input defaultValue="Mumbai, Maharashtra" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'business' && (
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Business Name
                  </label>
                  <Input defaultValue="My Wedding Venue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    GST Number
                  </label>
                  <Input defaultValue="27AABCU9603R1ZM" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Business Address
                  </label>
                  <Input defaultValue="123 Wedding Lane, Mumbai, Maharashtra 400001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    PAN Number
                  </label>
                  <Input defaultValue="ABCDE1234F" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Business Type
                  </label>
                  <select className="w-full px-3 py-2 border border-divider rounded-md bg-white">
                    <option>Wedding Venue</option>
                    <option>Event Space</option>
                    <option>Banquet Hall</option>
                    <option>Resort</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New booking requests', description: 'Get notified when someone books your venue' },
                { label: 'Booking confirmations', description: 'Get notified when a booking is confirmed' },
                { label: 'Payment received', description: 'Get notified when you receive a payment' },
                { label: 'Reviews', description: 'Get notified when someone leaves a review' },
                { label: 'Marketing updates', description: 'Receive tips and updates from Vivah Verse' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-divider last:border-0"
                >
                  <div>
                    <p className="font-medium text-charcoal">{item.label}</p>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                  <button className="relative w-12 h-6 rounded-full bg-success transition-colors">
                    <span className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full transition-transform" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Bank Account Name
                  </label>
                  <Input defaultValue="My Business Account" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Account Number
                  </label>
                  <Input defaultValue="•••• •••• •••• 1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    IFSC Code
                  </label>
                  <Input defaultValue="HDFC0001234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    UPI ID
                  </label>
                  <Input defaultValue="business@upi" />
                </div>
              </div>
              <div className="pt-4 border-t border-divider">
                <h4 className="font-medium text-charcoal mb-2">Payout Schedule</h4>
                <p className="text-sm text-muted">
                  Payouts are processed within 3-5 business days after the event date.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-charcoal mb-3">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Current Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div />
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      New Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Confirm New Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Update Password
                </Button>
              </div>

              <div className="pt-4 border-t border-divider">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-charcoal">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-divider">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-error">Delete Account</h4>
                    <p className="text-sm text-muted">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-error border-error hover:bg-error/10">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
