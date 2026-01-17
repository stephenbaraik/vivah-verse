import { api } from '@/lib/api';
import type {
  Wedding,
  CreateWeddingRequest,
  UpdateWeddingRequest,
  WeddingDashboard,
  AuspiciousDate
} from '@/types/api';

/**
 * Weddings Service
 * Handles wedding project management
 */
export const WeddingsService = {
  /**
   * Get all weddings for current user (as couple)
   */
  async getMyWeddings(): Promise<Wedding[]> {
    const response = await api.get<Wedding[]>('/weddings/my');
    return response.data;
  },

  /**
   * Get weddings assigned to current user (as planner)
   */
  async getAssignedWeddings(): Promise<Wedding[]> {
    const response = await api.get<Wedding[]>('/weddings/assigned');
    return response.data;
  },

  /**
   * Get all weddings (admin only)
   */
  async getAllWeddings(): Promise<Wedding[]> {
    const response = await api.get<Wedding[]>('/weddings/all');
    return response.data;
  },

  /**
   * Get current user's wedding (first one - for backward compatibility)
   */
  async getMyWedding(): Promise<Wedding | null> {
    const weddings = await this.getMyWeddings();
    return weddings[0] ?? null;
  },

  /**
   * Create wedding project
   */
  async create(data: CreateWeddingRequest): Promise<Wedding> {
    const response = await api.post<Wedding>('/weddings', data);
    return response.data;
  },

  /**
   * Update wedding project
   */
  async update(weddingId: string, data: UpdateWeddingRequest): Promise<Wedding> {
    const response = await api.patch<Wedding>(`/weddings/${weddingId}`, data);
    return response.data;
  },

  /**
   * Get wedding by ID
   */
  async getById(id: string): Promise<Wedding> {
    const response = await api.get<Wedding>(`/weddings/${id}`);
    return response.data;
  },

  /**
   * Get auspicious dates for given month/year
   */
  async getAuspiciousDates(
    month: number,
    year: number
  ): Promise<{ date: string; significance: string }[]> {
    const response = await api.get('/weddings/auspicious-dates', {
      params: { month, year },
    });
    return response.data;
  },

  /**
   * Get wedding dashboard data
   */
  async getDashboard(): Promise<WeddingDashboard> {
    const response = await api.get<WeddingDashboard>('/weddings/dashboard');
    return response.data;
  },
};
