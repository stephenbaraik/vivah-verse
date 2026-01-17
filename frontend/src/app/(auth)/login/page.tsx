'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useLogin } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          // Redirect based on role
          if (data.user.role === 'ADMIN') {
            router.push('/admin');
          } else if (data.user.role === 'VENDOR') {
            router.push('/vendor');
          } else {
            router.push('/');
          }
        },
      }
    );
  };

  return (
    <Card padding="lg" className="shadow-sm shadow-charcoal/10">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-2xl">Welcome back</CardTitle>
        <p className="text-center text-muted text-xs sm:text-sm">
          Sign in to continue planning your perfect wedding
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-divider/50 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-muted">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-rani font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={login.isPending}
          >
            Sign in
          </Button>
        </form>

        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm">
          <span className="text-muted">Don&apos;t have an account? </span>
          <Link href="/register" className="text-rani hover:underline font-semibold">
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
