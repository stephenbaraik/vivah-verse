'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractsService } from '@/services/contracts.service';
import { useToast } from '@/stores/toast-store';
import type {
  CreateContractRequest,
  UpdateContractRequest,
  MutationError
} from '@/types/api';

/**
 * Contracts feature hooks
 */

/**
 * Fetch all contracts
 */
export function useContracts(weddingId?: string) {
  return useQuery({
    queryKey: ['contracts', weddingId ? { weddingId } : 'all'],
    queryFn: () => ContractsService.getAll(weddingId ? { weddingId } : undefined),
  });
}

/**
 * Fetch contract by ID
 */
export function useContract(contractId: string) {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => ContractsService.getById(contractId),
    enabled: !!contractId,
  });
}

/**
 * Create contract mutation
 */
export function useCreateContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateContractRequest) => ContractsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      addToast({ type: 'success', message: 'Contract created successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create contract',
      });
    },
  });
}

/**
 * Update contract mutation
 */
export function useUpdateContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ contractId, data }: { contractId: string; data: UpdateContractRequest }) =>
      ContractsService.update(contractId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract'] });
      addToast({ type: 'success', message: 'Contract updated successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update contract',
      });
    },
  });
}

/**
 * Sign contract mutation
 */
export function useSignContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (contractId: string) => ContractsService.sign(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract'] });
      addToast({ type: 'success', message: 'Contract signed successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to sign contract',
      });
    },
  });
}

/**
 * Delete contract mutation
 */
export function useDeleteContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (contractId: string) => ContractsService.delete(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      addToast({ type: 'success', message: 'Contract deleted successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete contract',
      });
    },
  });
}