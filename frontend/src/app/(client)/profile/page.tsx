'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Bell,
  Shield,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
} from '@/components/ui';
import { UsersService } from '@/services/users.service';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email: {
      bookingUpdates: true,
      promotions: false,
      newsletter: true,
    },
    push: {
      bookingUpdates: true,
      messages: true,
    },
    sms: {
      bookingReminders: true,
    },
  });

  // Fetch profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => UsersService.getProfile(),
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setCity(profile.profile?.city || '');
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; phone?: string; city?: string }) =>
      UsersService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (user) {
        setUser({
          ...user,
          name: updatedProfile.name || user.name,
          phone: updatedProfile.phone || user.phone,
        });
      }
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      UsersService.changePassword(data),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Logout after password change
      setTimeout(() => {
        logout();
        router.push('/');
      }, 2000);
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => UsersService.deleteAccount(password),
    onSuccess: () => {
      logout();
      router.push('/');
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ name, phone, city });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      alert('Please enter your password');
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleNotification = (
    category: 'email' | 'push' | 'sms',
    key: string
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev.email],
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rani" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Profile Settings
          </h1>
          <p className="text-muted mt-1">
            Manage your account and preferences
          </p>
        </div>
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
                  <p className="text-sm text-muted mt-4 text-center">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                  <p className="text-sm font-medium text-charcoal mt-2">
                    {user?.email}
                  </p>
                  <span className="text-xs px-2 py-1 bg-cream text-gold rounded mt-1">
                    {user?.role}
                  </span>
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
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      City
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isPending
                      ? 'Saving...'
                      : updateProfileMutation.isSuccess
                      ? 'Saved!'
                      : 'Save Changes'}
                  </Button>
                </div>
                {updateProfileMutation.isError && (
                  <p className="text-error text-sm">
                    Failed to update profile. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="font-medium text-charcoal mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'bookingUpdates',
                      label: 'Booking Updates',
                      description: 'Get notified about your bookings',
                    },
                    {
                      key: 'promotions',
                      label: 'Promotions',
                      description: 'Receive special offers and deals',
                    },
                    {
                      key: 'newsletter',
                      label: 'Newsletter',
                      description: 'Wedding tips and inspiration',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium text-charcoal">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted">{item.description}</p>
                      </div>
                      <button
                        onClick={() =>
                          toggleNotification('email', item.key)
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications.email[
                            item.key as keyof typeof notifications.email
                          ]
                            ? 'bg-success'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            notifications.email[
                              item.key as keyof typeof notifications.email
                            ]
                              ? 'left-7'
                              : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h3 className="font-medium text-charcoal mb-4">
                  Push Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'bookingUpdates',
                      label: 'Booking Updates',
                      description: 'Real-time booking notifications',
                    },
                    {
                      key: 'messages',
                      label: 'Messages',
                      description: 'New messages from vendors',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium text-charcoal">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted">{item.description}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification('push', item.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications.push[
                            item.key as keyof typeof notifications.push
                          ]
                            ? 'bg-success'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            notifications.push[
                              item.key as keyof typeof notifications.push
                            ]
                              ? 'left-7'
                              : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h3 className="font-medium text-charcoal mb-4">
                  SMS Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-charcoal">
                        Booking Reminders
                      </p>
                      <p className="text-sm text-muted">
                        Get SMS reminders before your events
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        toggleNotification('sms', 'bookingReminders')
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.sms.bookingReminders
                          ? 'bg-success'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications.sms.bookingReminders
                            ? 'left-7'
                            : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? 'Changing...'
                      : 'Change Password'}
                  </Button>
                  {changePasswordMutation.isSuccess && (
                    <p className="text-success text-sm">
                      Password changed! Logging out...
                    </p>
                  )}
                  {changePasswordMutation.isError && (
                    <p className="text-error text-sm">
                      Failed to change password. Check your current password.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted">
                    You are currently logged in on this device.
                  </p>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout from all devices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-error/30">
              <CardHeader>
                <CardTitle className="text-error">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                {!showDeleteConfirm ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button
                      variant="outline"
                      className="border-error text-error hover:bg-error/10"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 bg-error/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-error">
                          Are you absolutely sure?
                        </p>
                        <p className="text-sm text-muted mt-1">
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Enter your password to confirm
                      </label>
                      <Input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-error hover:bg-error/90"
                        onClick={handleDeleteAccount}
                        disabled={deleteAccountMutation.isPending}
                      >
                        {deleteAccountMutation.isPending
                          ? 'Deleting...'
                          : 'Delete my account'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}
