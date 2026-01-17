'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui';
import { AuthService } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  contextMessage?: string;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  contextMessage,
  defaultMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: () => AuthService.login({ email: formData.email, password: formData.password }),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      setErrors({ general: error.message || 'Invalid email or password' });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: () =>
      AuthService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role: 'CLIENT',
      }),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      setErrors({ general: error.message || 'Registration failed' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (mode === 'register' && !formData.name) newErrors.name = 'Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (mode === 'login') {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, type: 'spring', bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-elevated w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-rani to-rani/80 px-6 py-8 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-gold" />
                  <h2 className="text-2xl font-serif font-semibold">
                    {mode === 'login' ? 'Welcome Back' : 'Join Vivah Verse'}
                  </h2>
                </div>

                {contextMessage ? (
                  <p className="text-white/90 text-sm">{contextMessage}</p>
                ) : (
                  <p className="text-white/90 text-sm">
                    {mode === 'login'
                      ? 'Sign in to continue planning your dream wedding'
                      : 'Create an account to save venues and manage bookings'}
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errors.general && (
                  <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                    {errors.general}
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 border rounded-lg',
                          'focus:outline-none focus:ring-2 focus:ring-rani focus:border-transparent',
                          errors.name ? 'border-error' : 'border-divider'
                        )}
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-error">{errors.name}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn(
                        'w-full pl-10 pr-4 py-2.5 border rounded-lg',
                        'focus:outline-none focus:ring-2 focus:ring-rani focus:border-transparent',
                        errors.email ? 'border-error' : 'border-divider'
                      )}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-error">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={cn(
                        'w-full pl-10 pr-12 py-2.5 border rounded-lg',
                        'focus:outline-none focus:ring-2 focus:ring-rani focus:border-transparent',
                        errors.password ? 'border-error' : 'border-divider'
                      )}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-error">{errors.password}</p>
                  )}
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-rani focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Please wait...'
                    : mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </Button>

                <div className="text-center text-sm text-muted">
                  {mode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-rani font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-rani font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="px-6 pb-6 text-center text-xs text-muted">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-rani hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-rani hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
