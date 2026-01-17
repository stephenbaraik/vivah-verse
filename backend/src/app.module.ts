import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
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
import { HealthModule } from './health/health.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { InfraModule } from './infra/infra.module';
import { QueueModule } from './queue/queue.module';
import { SearchModule } from './search/search.module';
import { GraphqlModule } from './graphql/graphql.module';
import { TasksModule } from './tasks/tasks.module';
import { TimelinesModule } from './timelines/timelines.module';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  messageFormat: '{msg}',
                },
              }
            : undefined,
        autoLogging: true,
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        customProps: (req) => ({
          requestId: (req as any).requestId,
          userId: (req as any).user?.id,
        }),
      },
    }),
    // Rate limiting: 100 requests per 60 seconds globally
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    InfraModule,
    QueueModule.register(),
    PrismaModule,
    GraphqlModule,
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
    NotificationsModule.register(),
    InvoicesModule,
    HealthModule,
    RecommendationsModule,
    SearchModule.register(),
    TasksModule,
    TimelinesModule,
    ContractsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
