import { Module } from '@nestjs/common';
import { WeddingsController } from './weddings.controller';
import { WeddingsService } from './weddings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WeddingsController],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
