'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useRegister } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

type Role = 'CLIENT' | 'VENDOR';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  
  const [role, setRole] = useState<Role>('CLIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    register.mutate(
      { email, password, role },
      {
        onSuccess: (data) => {
          if (data.user.role === 'VENDOR') {
            router.push('/vendor');
          } else {
            router.push('/');
          }
        },
      }
    );
  };

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle className="text-center">Create your account</CardTitle>
        <p className="text-center text-muted text-sm">
          Join thousands planning their perfect wedding
        </p>
      </CardHeader>
      <CardContent>
        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-charcoal mb-2">
            I want to...
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={cn(
                'p-4 rounded-lg border-2 text-center transition-colors',
                role === 'CLIENT'
                  ? 'border-rani bg-rose-soft'
                  : 'border-divider hover:border-gold/50'
              )}
            >
              <span className="text-2xl block mb-1">💍</span>
              <span className="font-medium text-sm">Plan my wedding</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('VENDOR')}
              className={cn(
                'p-4 rounded-lg border-2 text-center transition-colors',
                role === 'VENDOR'
                  ? 'border-rani bg-rose-soft'
                  : 'border-divider hover:border-gold/50'
              )}
            >
              <span className="text-2xl block mb-1">🏛️</span>
              <span className="font-medium text-sm">List my venue/service</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint="At least 6 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="text-sm text-muted">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-rani hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-rani hover:underline">
              Privacy Policy
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={register.isPending}
          >
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted">Already have an account? </span>
          <Link href="/login" className="text-rani hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
