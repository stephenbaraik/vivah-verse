import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type Redis from 'ioredis';
import type { MeiliSearch } from 'meilisearch';
import { MEILI_CLIENT, REDIS_CLIENT } from '../infra/infra.module';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    @Optional() @Inject(REDIS_CLIENT) private readonly redis: Redis | null,
    @Optional()
    @Inject(MEILI_CLIENT)
    private readonly meili: MeiliSearch | null,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async health() {
    const startedAt = Date.now();
    const withTimeout = async <T>(
      promise: Promise<T>,
      ms: number,
    ): Promise<T> => {
      let timeoutHandle: NodeJS.Timeout | undefined;
      try {
        return await Promise.race([
          promise,
          new Promise<T>((_, reject) => {
            timeoutHandle = setTimeout(() => reject(new Error('timeout')), ms);
          }),
        ]);
      } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle);
      }
    };

    try {
      // Lightweight DB round-trip
      await this.prisma.$queryRaw`SELECT 1`;

      let redisStatus: 'ok' | 'skipped' | 'error' = 'skipped';
      let searchStatus: 'ok' | 'skipped' | 'error' = 'skipped';

      if (this.redis) {
        try {
          await withTimeout(this.redis.ping(), 800);
          redisStatus = 'ok';
        } catch {
          redisStatus = 'error';
        }
      }

      if (this.meili) {
        try {
          await withTimeout(this.meili.health(), 800);
          searchStatus = 'ok';
        } catch {
          searchStatus = 'error';
        }
      }

      const degraded = redisStatus === 'error' || searchStatus === 'error';

      return {
        status: degraded ? 'degraded' : 'ok',
        db: 'ok',
        redis: redisStatus,
        search: searchStatus,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      };
    } catch {
      return {
        status: 'degraded',
        db: 'error',
        redis: this.redis ? 'error' : 'skipped',
        search: this.meili ? 'error' : 'skipped',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      };
    }
  }
}
