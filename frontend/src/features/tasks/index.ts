'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '@/services/tasks.service';
import { useToast } from '@/stores/toast-store';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  MutationError
} from '@/types/api';

/**
 * Tasks feature hooks
 */

/**
 * Fetch all tasks
 */
export function useTasks(weddingId?: string) {
  return useQuery({
    queryKey: ['tasks', weddingId ? { weddingId } : 'all'],
    queryFn: () => TasksService.getAll(weddingId ? { weddingId } : undefined),
  });
}

/**
 * Fetch task by ID
 */
export function useTask(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => TasksService.getById(taskId),
    enabled: !!taskId,
  });
}

/**
 * Create task mutation
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => TasksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({ type: 'success', message: 'Task created successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create task',
      });
    },
  });
}

/**
 * Update task mutation
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      TasksService.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
      addToast({ type: 'success', message: 'Task updated successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update task',
      });
    },
  });
}

/**
 * Update task status mutation
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: UpdateTaskStatusRequest }) =>
      TasksService.updateStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
      addToast({ type: 'success', message: 'Task status updated!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update task status',
      });
    },
  });
}

/**
 * Delete task mutation
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (taskId: string) => TasksService.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({ type: 'success', message: 'Task deleted successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete task',
      });
    },
  });
}