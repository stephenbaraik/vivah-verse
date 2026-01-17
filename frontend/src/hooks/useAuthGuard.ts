'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

type Role = 'CLIENT' | 'VENDOR' | 'ADMIN';

interface AuthGuardOptions {
  requiredRole?: Role;
  redirectTo?: string;
}

/**
 * Role-aware authentication guard hook
 * Redirects unauthenticated users or users with wrong role
 */
export function useAuthGuard(options: AuthGuardOptions = {}) {
  const { requiredRole, redirectTo = '/login' } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for store hydration
    if (!isHydrated) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    // Role mismatch - redirect to appropriate dashboard
    if (requiredRole && user.role !== requiredRole) {
      const roleRedirects: Record<Role, string> = {
        CLIENT: '/dashboard',
        VENDOR: '/vendor',
        ADMIN: '/admin',
      };
      router.replace(roleRedirects[user.role as Role] || '/');
    }
  }, [isHydrated, isAuthenticated, user, requiredRole, redirectTo, router, pathname]);

  return {
    user,
    isAuthenticated,
    isLoading: !isHydrated,
    hasAccess: isAuthenticated && (!requiredRole || user?.role === requiredRole),
  };
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: Role | Role[]): boolean {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role as Role);
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useRedirectIfAuthenticated(redirectTo?: string) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated && user) {
      const roleRedirects: Record<Role, string> = {
        CLIENT: '/dashboard',
        VENDOR: '/vendor',
        ADMIN: '/admin',
      };
      router.replace(redirectTo || roleRedirects[user.role as Role] || '/');
    }
  }, [isHydrated, isAuthenticated, user, redirectTo, router]);

  return { isLoading: !isHydrated };
}
