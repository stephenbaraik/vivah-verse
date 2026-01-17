/**
 * Wedding API Types
 * Wedding profile and planning
 */

import type { ID, Timestamps } from './common';
import type { Payment } from './payment';
import type { Booking } from './booking';

/**
 * Wedding status enum
 */
export type WeddingStatus = 'LEAD' | 'BOOKED' | 'PLANNING' | 'EXECUTION' | 'COMPLETED';

/**
 * Wedding profile
 */
export type Wedding = {
  id: ID;
  userId: ID;
  plannerId?: ID;
  weddingDate: string;
  location: string;
  guestCount: number;
  budget: number;
  status: WeddingStatus;
  createdAt: string;
  updatedAt: string;

  // Relations (populated based on includes)
  user?: {
    id: ID;
    name?: string;
    email: string;
  };
  planner?: {
    id: ID;
    name?: string;
    email: string;
  };
  tasks?: Task[];
  timelines?: Timeline[];
  payments?: Payment[];
  contracts?: Contract[];
  booking?: Booking;
};

/**
 * Create wedding request
 */
export type CreateWeddingRequest = {
  weddingDate: string;
  location?: string;
  guestCount: number;
  budget?: number;
};

/**
 * Update wedding request
 */
export type UpdateWeddingRequest = Partial<CreateWeddingRequest> & {
  status?: WeddingStatus;
  plannerId?: ID;
};

/**
 * Auspicious date info
 */
export type AuspiciousDate = {
  date: string;
  significance: string;
  muhurat?: string;
};

/**
 * Wedding dashboard data
 */
export type WeddingDashboard = {
  wedding: Wedding;
  daysUntilWedding: number;
  bookings: {
    confirmed: number;
    pending: number;
    total: number;
  };
  payments: {
    paid: number;
    pending: number;
    total: number;
  };
  checklist: {
    completed: number;
    total: number;
  };
  tasks: {
    todo: number;
    inProgress: number;
    done: number;
  };
};

/**
 * API Endpoints:
 * POST /weddings         → Wedding
 * GET  /weddings/my      → Wedding[]
 * GET  /weddings/assigned → Wedding[] (for planners)
 * GET  /weddings/all     → Wedding[] (for admins)
 * PATCH /weddings/:id    → Wedding
 * GET  /weddings/:id     → Wedding
 * GET  /weddings/auspicious-dates?month=X&year=Y → AuspiciousDate[]
 * GET  /weddings/dashboard → WeddingDashboard
 *
 * Tasks:
 * POST /tasks            → Task
 * GET  /tasks            → Task[]
 * GET  /tasks/:id        → Task
 * PATCH /tasks/:id       → Task
 * PATCH /tasks/:id/status → Task
 * DELETE /tasks/:id      → void
 *
 * Timelines:
 * POST /timelines        → Timeline
 * GET  /timelines        → Timeline[]
 * GET  /timelines/:id    → Timeline
 * PATCH /timelines/:id   → Timeline
 * DELETE /timelines/:id  → void
 *
 * Contracts:
 * POST /contracts        → Contract
 * GET  /contracts        → Contract[]
 * GET  /contracts/:id    → Contract
 * PATCH /contracts/:id   → Contract
 * PATCH /contracts/:id/sign → Contract
 * DELETE /contracts/:id  → void
 */

/**
 * Task status enum
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/**
 * Task category enum
 */
export type TaskCategory = 'VENUE' | 'DECOR' | 'CATERING' | 'PHOTOGRAPHY' | 'MUSIC' | 'OTHER';

/**
 * Task
 */
export type Task = {
  id: ID;
  weddingId: ID;
  title: string;
  category: TaskCategory;
  assignedTo?: ID;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;

  // Relations
  assignee?: {
    id: ID;
    name?: string;
    email: string;
  };
};

/**
 * Create task request
 */
export type CreateTaskRequest = {
  weddingId: ID;
  title: string;
  category: TaskCategory;
  assignedTo?: ID;
  dueDate?: string;
};

/**
 * Update task request
 */
export type UpdateTaskRequest = Partial<CreateTaskRequest>;

/**
 * Update task status request
 */
export type UpdateTaskStatusRequest = {
  status: TaskStatus;
};

/**
 * Timeline/Milestone
 */
export type Timeline = {
  id: ID;
  weddingId: ID;
  milestone: string;
  dueDate: string;
  createdAt: string;
};

/**
 * Create timeline request
 */
export type CreateTimelineRequest = {
  weddingId: ID;
  milestone: string;
  dueDate: string;
};

/**
 * Update timeline request
 */
export type UpdateTimelineRequest = Partial<CreateTimelineRequest>;

/**
 * Contract
 */
export type Contract = {
  id: ID;
  weddingId: ID;
  vendorId: ID;
  terms: string;
  signed: boolean;
  createdAt: string;

  // Relations
  vendor?: {
    id: ID;
    businessName: string;
    user: {
      name?: string;
      email: string;
    };
  };
};

/**
 * Create contract request
 */
export type CreateContractRequest = {
  weddingId: ID;
  vendorId: ID;
  terms: string;
};

/**
 * Update contract request
 */
export type UpdateContractRequest = Partial<CreateContractRequest>;
