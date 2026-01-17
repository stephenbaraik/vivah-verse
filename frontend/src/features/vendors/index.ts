'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VendorsService, AdminVendorsService } from '@/services/vendors.service';
import { useToast } from '@/stores/toast-store';
import type { CreateVendorRequest, MutationError } from '@/types/api';

/**
 * Vendors feature hooks
 */

export function useVendorProfile() {
  return useQuery({
    queryKey: ['vendor', 'profile'],
    queryFn: () => VendorsService.getProfile(),
  });
}

export function useCreateVendorProfile() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateVendorRequest) => VendorsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'profile'] });
      addToast({ type: 'success', message: 'Vendor profile created!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create profile',
      });
    },
  });
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<CreateVendorRequest>) => VendorsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'profile'] });
      addToast({ type: 'success', message: 'Profile updated!' });
    },
  });
}

export function useVendorStats() {
  return useQuery({
    queryKey: ['vendor', 'stats'],
    queryFn: () => VendorsService.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useUploadDocuments() {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ files, type }: { files: File[]; type: string }) =>
      VendorsService.uploadDocuments(files, type),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Documents uploaded!' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to upload documents' });
    },
  });
}

// Admin hooks
export function usePendingVendors() {
  return useQuery({
    queryKey: ['admin', 'vendors', 'pending'],
    queryFn: () => AdminVendorsService.getPending(),
  });
}

export function useAllVendors(params?: {
  approved?: boolean;
  city?: string;
  serviceType?: string;
}) {
  return useQuery({
    queryKey: ['admin', 'vendors', params],
    queryFn: () => AdminVendorsService.getAll(params),
  });
}

export function useApproveVendor() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (vendorId: string) => AdminVendorsService.approve(vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
      addToast({ type: 'success', message: 'Vendor approved!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to approve vendor',
      });
    },
  });
}

export function useRejectVendor() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ vendorId, reason }: { vendorId: string; reason?: string }) =>
      AdminVendorsService.reject(vendorId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
      addToast({ type: 'success', message: 'Vendor rejected' });
    },
  });
}

export function useVendorDocuments(vendorId: string) {
  return useQuery({
    queryKey: ['admin', 'vendors', vendorId, 'documents'],
    queryFn: () => AdminVendorsService.getDocuments(vendorId),
    enabled: !!vendorId,
  });
}

// Vendor Dashboard hooks
export function useVendorDashboard() {
  return useQuery({
    queryKey: ['vendor', 'dashboard'],
    queryFn: () => VendorsService.getDashboard(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useVendorBookings(params?: {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['vendor', 'bookings', params],
    queryFn: () => VendorsService.getBookings(params),
  });
}

export function useVendorCalendar(month: string) {
  return useQuery({
    queryKey: ['vendor', 'calendar', month],
    queryFn: () => VendorsService.getCalendar(month),
    enabled: !!month,
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ date, status }: { date: string; status: 'AVAILABLE' | 'BLOCKED' }) =>
      VendorsService.updateAvailability(date, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'calendar'] });
      addToast({
        type: 'success',
        message: variables.status === 'BLOCKED' ? 'Date blocked' : 'Date unblocked',
      });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update availability' });
    },
  });
}

export function useVendorEarnings() {
  return useQuery({
    queryKey: ['vendor', 'earnings'],
    queryFn: () => VendorsService.getEarnings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
