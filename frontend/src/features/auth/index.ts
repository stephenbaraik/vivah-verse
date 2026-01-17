'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AuthService } from '@/services/auth.service';
import { useToast } from '@/stores/toast-store';
import type { LoginRequest, RegisterRequest, MutationError } from '@/types/api';

/**
 * Auth feature hooks
 * Combines React Query with Zustand for auth operations
 */

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);
      addToast({ type: 'success', message: 'Welcome back!' });

      // Redirect based on role
      const roleRedirects = {
        CLIENT: '/dashboard',
        VENDOR: '/vendor',
        ADMIN: '/admin',
      };
      router.push(roleRedirects[response.user.role as keyof typeof roleRedirects] || '/');
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Login failed',
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);
      addToast({ type: 'success', message: 'Account created successfully!' });

      // Redirect to onboarding
      const onboardingRoutes = {
        CLIENT: '/onboarding',
        VENDOR: '/vendor/onboarding',
        ADMIN: '/admin',
      };
      router.push(onboardingRoutes[response.user.role as keyof typeof onboardingRoutes] || '/');
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed',
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      addToast({ type: 'success', message: 'Logged out successfully' });
      router.push('/login');
    },
    onError: () => {
      // Still logout locally even if API fails
      logout();
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useLogoutAll() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: () => AuthService.logoutAll(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      addToast({ type: 'success', message: 'Logged out from all devices' });
      router.push('/login');
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => AuthService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSessions() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => AuthService.getSessions(),
    enabled: isAuthenticated,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (sessionId: string) => AuthService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      addToast({ type: 'success', message: 'Session revoked' });
    },
  });
}
