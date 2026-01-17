'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TimelinesService } from '@/services/timelines.service';
import { useToast } from '@/stores/toast-store';
import type {
  CreateTimelineRequest,
  UpdateTimelineRequest,
  MutationError
} from '@/types/api';

/**
 * Timelines feature hooks
 */

/**
 * Fetch all timelines
 */
export function useTimelines(weddingId?: string) {
  return useQuery({
    queryKey: ['timelines', weddingId ? { weddingId } : 'all'],
    queryFn: () => TimelinesService.getAll(weddingId ? { weddingId } : undefined),
  });
}

/**
 * Fetch timeline by ID
 */
export function useTimeline(timelineId: string) {
  return useQuery({
    queryKey: ['timeline', timelineId],
    queryFn: () => TimelinesService.getById(timelineId),
    enabled: !!timelineId,
  });
}

/**
 * Create timeline mutation
 */
export function useCreateTimeline() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTimelineRequest) => TimelinesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
      addToast({ type: 'success', message: 'Milestone added successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add milestone',
      });
    },
  });
}

/**
 * Update timeline mutation
 */
export function useUpdateTimeline() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ timelineId, data }: { timelineId: string; data: UpdateTimelineRequest }) =>
      TimelinesService.update(timelineId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
      addToast({ type: 'success', message: 'Milestone updated successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update milestone',
      });
    },
  });
}

/**
 * Delete timeline mutation
 */
export function useDeleteTimeline() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (timelineId: string) => TimelinesService.delete(timelineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
      addToast({ type: 'success', message: 'Milestone deleted successfully!' });
    },
    onError: (error: MutationError) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete milestone',
      });
    },
  });
}