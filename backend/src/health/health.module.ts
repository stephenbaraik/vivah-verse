import { Module } from '@nestjs/common';
import { InfraModule } from '../infra/infra.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule, InfraModule],
  controllers: [HealthController],
})
export class HealthModule {}
