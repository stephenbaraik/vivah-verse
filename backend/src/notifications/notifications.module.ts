import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';

@Module({})
export class NotificationsModule {
  static register(): DynamicModule {
    const redisUrl = process.env.REDIS_URL;
    const base = {
      module: NotificationsModule,
      providers: [NotificationsService],
      exports: [NotificationsService],
    };

    if (!redisUrl) return base;

    return {
      ...base,
      imports: [BullModule.registerQueue({ name: 'notifications' })],
      providers: [...base.providers, NotificationsProcessor],
    };
  }
}
