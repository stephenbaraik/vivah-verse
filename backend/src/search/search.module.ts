import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InfraModule } from '../infra/infra.module';
import { PrismaModule } from '../prisma/prisma.module';
import { VenuesModule } from '../venues/venues.module';
import { SearchController } from './search.controller';
import { SearchProcessor } from './search.processor';
import { SearchService } from './search.service';

@Module({})
export class SearchModule {
  static register(): DynamicModule {
    const redisUrl = process.env.REDIS_URL;

    const base: DynamicModule = {
      module: SearchModule,
      imports: [InfraModule, PrismaModule, VenuesModule],
      controllers: [SearchController],
      providers: [SearchService],
      exports: [SearchService],
    };

    if (!redisUrl) return base;

    return {
      ...base,
      imports: [
        ...(base.imports ?? []),
        BullModule.registerQueue({ name: 'search' }),
      ],
      providers: [...(base.providers ?? []), SearchProcessor],
    };
  }
}
