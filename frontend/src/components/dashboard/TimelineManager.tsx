'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { useTimelines, useCreateTimeline, useDeleteTimeline } from '@/features/timelines';
import { useWedding } from '@/features/wedding';

interface TimelineManagerProps {
  weddingId: string;
  className?: string;
}

/**
 * Timeline Manager component for wedding milestones
 */
export function TimelineManager({ weddingId, className }: TimelineManagerProps) {
  const { data: wedding } = useWedding(weddingId);
  const { data: timelines, isLoading } = useTimelines(weddingId);
  const createTimeline = useCreateTimeline();
  const deleteTimeline = useDeleteTimeline();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleCreateMilestone = () => {
    if (!newMilestone.trim() || !newDueDate) return;

    createTimeline.mutate({
      weddingId,
      milestone: newMilestone.trim(),
      dueDate: newDueDate,
    }, {
      onSuccess: () => {
        setNewMilestone('');
        setNewDueDate('');
        setShowCreateForm(false);
      },
    });
  };

  const handleDeleteMilestone = (timelineId: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      deleteTimeline.mutate(timelineId);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Wedding Timeline</CardTitle>
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

  // Sort timelines by due date
  const sortedTimelines = timelines?.sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  ) || [];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wedding Timeline</CardTitle>
        <Button
          onClick={() => setShowCreateForm(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="space-y-3">
              <div>
                <label htmlFor="milestone" className="block text-sm font-medium mb-1">Milestone</label>
                <Input
                  id="milestone"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="e.g., Venue booking deadline"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateMilestone} size="sm">
                  Add Milestone
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {sortedTimelines.map((timeline, index) => {
              const dueDate = new Date(timeline.dueDate);
              const today = new Date();
              const isPast = dueDate < today;
              const isToday = dueDate.toDateString() === today.toDateString();

              return (
                <motion.div
                  key={timeline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full border-4 border-white shadow-sm ${
                    isPast ? 'bg-red-500' : isToday ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{timeline.milestone}</h3>
                      <Button
                        onClick={() => handleDeleteMilestone(timeline.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${
                        isPast ? 'text-red-600' :
                        isToday ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {dueDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {isToday && ' (Today)'}
                        {isPast && ' (Past due)'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {(!timelines || timelines.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No milestones yet. Add your first milestone to track progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}