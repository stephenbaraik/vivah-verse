'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, CreditCard, ChevronRight, CalendarCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';

interface UpcomingEvent {
  type: 'event' | 'payment';
  title: string;
  date: string;
  amount?: number;
  actionUrl?: string;
}

interface UpcomingEventsProps {
  events?: UpcomingEvent[];
  className?: string;
}

const DEFAULT_EVENTS: UpcomingEvent[] = [
  {
    type: 'event',
    title: 'Venue Walkthrough',
    date: '2026-03-12T15:00:00',
  },
  {
    type: 'payment',
    title: 'Venue Balance Due',
    date: '2026-03-08',
    amount: 1000000,
    actionUrl: '/dashboard?tab=payments',
  },
];

/**
 * Upcoming events and payments widget
 */
export function UpcomingEvents({
  events = DEFAULT_EVENTS,
  className,
}: UpcomingEventsProps) {
  if (events.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted">
            <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-lg ${
                event.type === 'payment' ? 'bg-warning/10' : 'bg-rose-soft'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  event.type === 'payment' ? 'bg-warning' : 'bg-rani'
                }`}
              >
                {event.type === 'payment' ? (
                  <CreditCard className="w-5 h-5 text-white" />
                ) : (
                  <Clock className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal truncate">
                  {event.title}
                </p>
                <p className="text-sm text-muted">
                  {event.type === 'payment' && event.amount
                    ? `${formatCurrency(event.amount)} by ${formatDate(event.date)}`
                    : formatDate(event.date)}
                </p>
              </div>
              {event.actionUrl ? (
                <Link href={event.actionUrl}>
                  <Button size="sm">Pay Now</Button>
                </Link>
              ) : (
                <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
