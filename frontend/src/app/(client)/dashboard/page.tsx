'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, Skeleton } from '@/components/ui';
import {
  Timeline,
  Checklist,
  PaymentSummary,
  WeddingSummaryCard,
  UpcomingEvents,
  WeddingCountdown,
  BudgetTracker,
  GuestListManager,
  EditWeddingModal,
  WeddingServices,
  TaskManager,
  TimelineManager,
} from '@/components/dashboard';
import { useMyWeddings, useWeddingDashboard } from '@/features/wedding';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: weddings, isLoading: weddingsLoading } = useMyWeddings();
  const { data: dashboard, isLoading: dashboardLoading } = useWeddingDashboard();
  const [showEditModal, setShowEditModal] = useState(false);

  // Get the primary wedding (first one)
  const wedding = weddings?.[0];
  const weddingDateValue = wedding?.weddingDate;

  // Calculate days until wedding
  const daysUntilWedding = useMemo(() => {
    if (!weddingDateValue) return undefined;
    const weddingDate = new Date(weddingDateValue);
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [weddingDateValue]);

  const isLoading = weddingsLoading || dashboardLoading;

  // No wedding - prompt to create one
  if (!isLoading && !wedding) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-rose-soft flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-10 h-10 text-rani" />
            </motion.div>
            <h1 className="text-2xl font-serif font-semibold text-charcoal mb-2">
              Your planning journey starts here
            </h1>
            <p className="text-muted mb-6">
              Let&apos;s set up your wedding details to get started with finding the perfect venues
            </p>
            <Button onClick={() => router.push('/onboarding')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-semibold text-charcoal">
            Wedding Dashboard
          </h1>
          {daysUntilWedding && daysUntilWedding > 0 && (
            <p className="text-muted mt-1">
              {daysUntilWedding} days until your big day 💍
            </p>
          )}
        </div>
        <Link href="/concierge">
          <Button variant="secondary" leftIcon={<MessageCircle className="w-4 h-4" />} className="w-full sm:w-auto">
            Ask AI Concierge
          </Button>
        </Link>
      </div>

      {/* Wedding Countdown */}
      {wedding?.weddingDate && (
        <WeddingCountdown
          weddingDate={wedding.weddingDate}
        />
      )}

      {/* Budget and Guest List - Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BudgetTracker 
          onEditBudget={() => router.push('/dashboard/budget')}
        />
        <GuestListManager
          onAddGuest={() => router.push('/dashboard/guests/add')}
        />
      </div>

      {/* Wedding Summary Card */}
      {wedding && (
        <WeddingSummaryCard
          wedding={wedding}
          daysUntilWedding={daysUntilWedding}
          onEdit={() => setShowEditModal(true)}
        />
      )}

      {/* Edit Wedding Modal */}
      {wedding && (
        <EditWeddingModal
          wedding={wedding}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            queryClient.invalidateQueries({ queryKey: ['weddings'] });
            queryClient.invalidateQueries({ queryKey: ['wedding', 'dashboard'] });
          }}
        />
      )}

      {/* Task Manager and Timeline Manager */}
      {wedding && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TaskManager weddingId={wedding.id} />
          <TimelineManager weddingId={wedding.id} />
        </div>
      )}

      {/* Wedding Services - Venue, Catering, etc */}
      <WeddingServices />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: Progress */}
        <Card>
          <CardContent className="pt-6">
            <Timeline steps={[
              { label: 'Wedding created', done: !!wedding },
              { label: 'Planning phase', done: wedding?.status === 'PLANNING' || wedding?.status === 'EXECUTION' || wedding?.status === 'COMPLETED' },
              { label: 'Execution phase', done: wedding?.status === 'EXECUTION' || wedding?.status === 'COMPLETED' },
              { label: 'Wedding completed', done: wedding?.status === 'COMPLETED' },
            ]} />
          </CardContent>
        </Card>

        {/* Right Column: Upcoming */}
        <UpcomingEvents />
      </div>

      {/* Checklist based on tasks */}
      {wedding && dashboard && (
        <Card>
          <CardContent className="pt-6">
            <Checklist items={[
              { id: 'venue', label: 'Book venue', done: !!wedding.booking },
              { id: 'tasks', label: 'Complete wedding tasks', done: dashboard.tasks.done > 0 },
              { id: 'payments', label: 'Make payments', done: dashboard.payments.paid > 0 },
              { id: 'contracts', label: 'Sign contracts', done: wedding.contracts?.some(c => c.signed) ?? false },
            ]} editable={false} />
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      {dashboard && (
        <PaymentSummary
          payments={{
            totalAmount: dashboard.payments.total,
            paidAmount: dashboard.payments.paid,
            status: dashboard.payments.paid >= dashboard.payments.total && dashboard.payments.total > 0 ? 'PAID' :
                   dashboard.payments.paid > 0 ? 'PARTIAL' : 'PENDING'
          }}
          onPayNow={
            dashboard.payments.paid < dashboard.payments.total
              ? () => router.push('/dashboard?tab=payments')
              : undefined
          }
        />
      )}

      {/* Support CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-charcoal">Need assistance?</h4>
              <p className="text-sm text-muted">
                Our wedding coordinators are here to help
              </p>
            </div>
            <Button variant="secondary">Contact Support</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
