import { api } from '@/lib/api';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest
} from '@/types/api';

/**
 * Tasks Service
 * Handles wedding task management
 */
export const TasksService = {
  /**
   * Get all tasks (filtered by wedding/user based on auth)
   */
  async getAll(params?: { weddingId?: string }): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  /**
   * Get task by ID
   */
  async getById(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create new task
   */
  async create(data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  /**
   * Update task
   */
  async update(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Update task status
   */
  async updateStatus(id: string, data: UpdateTaskStatusRequest): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/status`, data);
    return response.data;
  },

  /**
   * Delete task
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};