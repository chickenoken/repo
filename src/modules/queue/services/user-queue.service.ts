import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

export enum UserQueueJobs {
  CREATE_USER = 'create-user',
  UPDATE_USER = 'update-user',
  PROCESS_USER_DATA = 'process-user-data',
  SEND_WELCOME_EMAIL = 'send-welcome-email',
}

@Injectable()
export class UserQueueService {
  constructor(
    @InjectQueue('user-queue') private readonly userQueue: Queue,
  ) {}

  // Add a job to create a user
  async addCreateUserJob(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.userQueue.add(UserQueueJobs.CREATE_USER, userData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  // Send welcome email job
  async addSendWelcomeEmailJob(user: { email: string; firstName: string }) {
    return this.userQueue.add(UserQueueJobs.SEND_WELCOME_EMAIL, user, {
      delay: 5000, // 5 seconds delay to ensure user is fully created
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 10000, // 10 seconds
      },
    });
  }

  // Process user data (example of a background job)
  async addProcessUserDataJob(userId: number) {
    return this.userQueue.add(UserQueueJobs.PROCESS_USER_DATA, { userId }, {
      priority: 5,
      attempts: 3,
    });
  }

  // Get queue metrics
  async getQueueMetrics() {
    const [jobs, completed, failed, delayed, waiting, active] = await Promise.all([
      this.userQueue.getJobs(['completed', 'failed', 'delayed', 'waiting', 'active']),
      this.userQueue.getCompletedCount(),
      this.userQueue.getFailedCount(),
      this.userQueue.getDelayedCount(),
      this.userQueue.getWaitingCount(),
      this.userQueue.getActiveCount(),
    ]);

    return {
      jobs: jobs.length,
      completed,
      failed,
      delayed,
      waiting,
      active,
    };
  }
}