import { api } from '@/lib/api';
import type {
  Timeline,
  CreateTimelineRequest,
  UpdateTimelineRequest
} from '@/types/api';

/**
 * Timelines Service
 * Handles wedding timeline/milestone management
 */
export const TimelinesService = {
  /**
   * Get all timelines (filtered by wedding based on auth)
   */
  async getAll(params?: { weddingId?: string }): Promise<Timeline[]> {
    const response = await api.get<Timeline[]>('/timelines', { params });
    return response.data;
  },

  /**
   * Get timeline by ID
   */
  async getById(id: string): Promise<Timeline> {
    const response = await api.get<Timeline>(`/timelines/${id}`);
    return response.data;
  },

  /**
   * Create new timeline/milestone
   */
  async create(data: CreateTimelineRequest): Promise<Timeline> {
    const response = await api.post<Timeline>('/timelines', data);
    return response.data;
  },

  /**
   * Update timeline/milestone
   */
  async update(id: string, data: UpdateTimelineRequest): Promise<Timeline> {
    const response = await api.patch<Timeline>(`/timelines/${id}`, data);
    return response.data;
  },

  /**
   * Delete timeline/milestone
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/timelines/${id}`);
  },
};