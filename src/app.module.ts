import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { WeddingsModule } from './weddings/weddings.module';
import { VendorsModule } from './vendors/vendors.module';
import { VenuesModule } from './venues/venues.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { CancellationsModule } from './cancellations/cancellations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    // Rate limiting: 100 requests per 60 seconds globally
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    WeddingsModule,
    VendorsModule,
    VenuesModule,
    AvailabilityModule,
    BookingsModule,
    AdminModule,
    PaymentsModule,
    CancellationsModule,
    NotificationsModule,
    InvoicesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
