import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UserQueueJobs } from '../services/user-queue.service';

@Processor('user-queue')
export class UserQueueProcessor {
  private readonly logger = new Logger(UserQueueProcessor.name);

  @Process(UserQueueJobs.CREATE_USER)
  async handleCreateUser(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    this.logger.debug('Job data:', job.data);
    
    try {
      this.logger.debug(`Job ${job.id} completed successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}`, error.stack);
      throw error;
    }
  }

  @Process(UserQueueJobs.SEND_WELCOME_EMAIL)
  async handleSendWelcomeEmail(job: Job) {
    this.logger.debug(`Processing welcome email job ${job.id}`);
    
    try {
      const { email, firstName } = job.data;
      
      this.logger.log(`Sending welcome email to ${email}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.logger.debug(`Welcome email sent to ${email}`);
      return { success: true, email };
    } catch (error) {
      this.logger.error(`Failed to send welcome email`, error.stack);
      throw error;
    }
  }

  @Process(UserQueueJobs.PROCESS_USER_DATA)
  async handleProcessUserData(job: Job) {
    this.logger.debug(`Processing user data job ${job.id}`);
    
    try {
      const { userId } = job.data;
      
      this.logger.log(`Processing data for user ${userId}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.logger.debug(`Data processing completed for user ${userId}`);
      return { success: true, userId };
    } catch (error) {
      this.logger.error(`Failed to process user data`, error.stack);
      throw error;
    }
  }
}