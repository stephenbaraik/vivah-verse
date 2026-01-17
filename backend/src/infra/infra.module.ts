import { Global, Module } from '@nestjs/common';
import type Redis from 'ioredis';
import type { MeiliSearch } from 'meilisearch';
import { createRedisClient } from './redis';
import { createMeiliClient } from './meilisearch';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export const MEILI_CLIENT = Symbol('MEILI_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (): Redis | null => {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) return null;

        return createRedisClient(redisUrl);
      },
    },
    {
      provide: MEILI_CLIENT,
      useFactory: (): MeiliSearch | null => {
        const host = process.env.MEILISEARCH_HOST;
        if (!host) return null;
        return createMeiliClient(host, process.env.MEILISEARCH_API_KEY);
      },
    },
  ],
  exports: [REDIS_CLIENT, MEILI_CLIENT],
})
export class InfraModule {}
