import type { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { parseRedisUrl } from '../infra/redis';

@Global()
@Module({})
export class QueueModule {
  static register(): DynamicModule {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      return {
        module: QueueModule,
        exports: [],
      };
    }

    const connection = parseRedisUrl(redisUrl);

    return {
      module: QueueModule,
      imports: [BullModule.forRoot({ connection })],
      exports: [BullModule],
    };
  }
}
