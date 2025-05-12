import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserQueueService } from './services/user-queue.service';
import { UserQueueProcessor } from './processors/user-queue.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'user-queue',
    }),
  ],
  providers: [UserQueueProcessor, UserQueueService],
  exports: [UserQueueService],
})
export class QueueModule {}