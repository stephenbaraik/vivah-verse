import { api } from '@/lib/api';
import type {
  Contract,
  CreateContractRequest,
  UpdateContractRequest
} from '@/types/api';

/**
 * Contracts Service
 * Handles wedding contract management
 */
export const ContractsService = {
  /**
   * Get all contracts (filtered by wedding/vendor based on auth)
   */
  async getAll(params?: { weddingId?: string }): Promise<Contract[]> {
    const response = await api.get<Contract[]>('/contracts', { params });
    return response.data;
  },

  /**
   * Get contract by ID
   */
  async getById(id: string): Promise<Contract> {
    const response = await api.get<Contract>(`/contracts/${id}`);
    return response.data;
  },

  /**
   * Create new contract
   */
  async create(data: CreateContractRequest): Promise<Contract> {
    const response = await api.post<Contract>('/contracts', data);
    return response.data;
  },

  /**
   * Update contract
   */
  async update(id: string, data: UpdateContractRequest): Promise<Contract> {
    const response = await api.patch<Contract>(`/contracts/${id}`, data);
    return response.data;
  },

  /**
   * Sign contract
   */
  async sign(id: string): Promise<Contract> {
    const response = await api.patch<Contract>(`/contracts/${id}/sign`, {});
    return response.data;
  },

  /**
   * Delete contract
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },
};