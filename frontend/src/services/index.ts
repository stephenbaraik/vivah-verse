/**
 * Services barrel export
 * All API services in one place
 */

export { AuthService } from './auth.service';
export { UsersService } from './users.service';
export { VenuesService } from './venues.service';
export { BookingsService } from './bookings.service';
export { PaymentsService, openRazorpayCheckout } from './payments.service';
export { VendorsService, AdminVendorsService } from './vendors.service';
export { WeddingsService } from './weddings.service';
export { TasksService } from './tasks.service';
export { TimelinesService } from './timelines.service';
export { ContractsService } from './contracts.service';
export { InvoicesService } from './invoices.service';
export { RecommendationsService } from './recommendations.service';

// Re-export all types for convenience
export type * from '@/types/api';

