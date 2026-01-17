'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Save,
  RefreshCw,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
} from '@/components/ui';

const settingsSections = [
  {
    id: 'general',
    title: 'General Settings',
    icon: Settings,
    settings: [
      { key: 'siteName', label: 'Site Name', type: 'text', value: 'Vivah Verse' },
      { key: 'supportEmail', label: 'Support Email', type: 'email', value: 'support@vivahverse.com' },
      { key: 'timezone', label: 'Default Timezone', type: 'select', value: 'Asia/Kolkata' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notification Settings',
    icon: Bell,
    settings: [
      { key: 'emailNotifications', label: 'Email Notifications', type: 'toggle', value: true },
      { key: 'smsNotifications', label: 'SMS Notifications', type: 'toggle', value: true },
      { key: 'adminAlerts', label: 'Admin Alerts', type: 'toggle', value: true },
    ],
  },
  {
    id: 'security',
    title: 'Security Settings',
    icon: Shield,
    settings: [
      { key: 'twoFactor', label: 'Require 2FA for Admins', type: 'toggle', value: false },
      { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number', value: 60 },
      { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number', value: 5 },
    ],
  },
  {
    id: 'payments',
    title: 'Payment Settings',
    icon: CreditCard,
    settings: [
      { key: 'platformFee', label: 'Platform Fee (%)', type: 'number', value: 5 },
      { key: 'minBookingAmount', label: 'Minimum Booking Amount (₹)', type: 'number', value: 10000 },
      { key: 'refundWindow', label: 'Refund Window (days)', type: 'number', value: 7 },
    ],
  },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const currentSection = settingsSections.find((s) => s.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Settings
          </h1>
          <p className="text-muted mt-1">
            Manage platform configuration and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="py-4">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                      isActive
                        ? 'bg-rose-soft text-rani'
                        : 'text-muted hover:bg-neutral-100 hover:text-charcoal'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {currentSection && (
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cream rounded-lg">
                      <currentSection.icon className="w-5 h-5 text-gold" />
                    </div>
                    <CardTitle>{currentSection.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentSection.settings.map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between py-3 border-b border-divider last:border-0"
                      >
                        <div>
                          <label className="font-medium text-charcoal">
                            {setting.label}
                          </label>
                        </div>
                        <div className="w-64">
                          {setting.type === 'toggle' ? (
                            <button
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                setting.value ? 'bg-success' : 'bg-neutral-300'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  setting.value ? 'left-7' : 'left-1'
                                }`}
                              />
                            </button>
                          ) : setting.type === 'select' ? (
                            <select className="w-full px-3 py-2 border border-divider rounded-md bg-white text-charcoal">
                              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                              <option value="UTC">UTC</option>
                              <option value="America/New_York">America/New_York (EST)</option>
                            </select>
                          ) : (
                            <Input
                              type={setting.type}
                              defaultValue={String(setting.value)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
