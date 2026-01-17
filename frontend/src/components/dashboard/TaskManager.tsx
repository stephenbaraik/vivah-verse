'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Circle, Clock, User } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { useTasks, useCreateTask, useUpdateTaskStatus } from '@/features/tasks';
import { useWedding } from '@/features/wedding';
import type { TaskStatus, TaskCategory } from '@/types/api';

interface TaskManagerProps {
  weddingId: string;
  className?: string;
}

const TASK_CATEGORIES: Record<TaskCategory, { label: string; color: string }> = {
  VENUE: { label: 'Venue', color: 'bg-blue-100 text-blue-800' },
  DECOR: { label: 'Decor', color: 'bg-purple-100 text-purple-800' },
  CATERING: { label: 'Catering', color: 'bg-green-100 text-green-800' },
  PHOTOGRAPHY: { label: 'Photography', color: 'bg-yellow-100 text-yellow-800' },
  MUSIC: { label: 'Music', color: 'bg-pink-100 text-pink-800' },
  OTHER: { label: 'Other', color: 'bg-gray-100 text-gray-800' },
};

const STATUS_ICONS = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  DONE: CheckCircle,
};

/**
 * Task Manager component for wedding project management
 */
export function TaskManager({ weddingId, className }: TaskManagerProps) {
  const { data: wedding } = useWedding(weddingId);
  const { data: tasks, isLoading } = useTasks(weddingId);
  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus.mutate({ taskId, status: { status } });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'DONE':
        return 'text-green-600';
      case 'IN_PROGRESS':
        return 'text-blue-600';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const todoTasks = tasks?.filter(task => task.status === 'TODO') || [];
  const inProgressTasks = tasks?.filter(task => task.status === 'IN_PROGRESS') || [];
  const doneTasks = tasks?.filter(task => task.status === 'DONE') || [];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wedding Tasks</CardTitle>
        <Button
          onClick={() => setShowCreateForm(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* To Do */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Circle className="w-4 h-4 text-gray-400" />
            To Do ({todoTasks.length})
          </h3>
          <div className="space-y-2">
            {todoTasks.map((task) => {
              const StatusIcon = STATUS_ICONS[task.status];
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <StatusIcon className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${TASK_CATEGORIES[task.category].color}`}>
                          {TASK_CATEGORIES[task.category].label}
                        </span>
                        {task.assignedTo && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            {task.assignee?.name || 'Assigned'}
                          </div>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* In Progress */}
        {inProgressTasks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              In Progress ({inProgressTasks.length})
            </h3>
            <div className="space-y-2">
              {inProgressTasks.map((task) => {
                const StatusIcon = STATUS_ICONS[task.status];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatusChange(task.id, 'DONE')}
                        className="text-blue-600 hover:text-green-600 transition-colors"
                      >
                        <StatusIcon className="w-5 h-5" />
                      </button>
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${TASK_CATEGORIES[task.category].color}`}>
                            {TASK_CATEGORIES[task.category].label}
                          </span>
                          {task.assignedTo && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              {task.assignee?.name || 'Assigned'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed */}
        {doneTasks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Completed ({doneTasks.length})
            </h3>
            <div className="space-y-2">
              {doneTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg opacity-75"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm line-through text-gray-600">{task.title}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${TASK_CATEGORIES[task.category].color}`}>
                      {TASK_CATEGORIES[task.category].label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}