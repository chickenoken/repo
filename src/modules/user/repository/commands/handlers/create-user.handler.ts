import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserService } from 'src/modules/user/services/user.service';
import { UserQueueService } from 'src/modules/queue/services/user-queue.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);
  
  constructor(
    private readonly userService: UserService,
    private readonly userQueueService: UserQueueService,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, password, firstName, lastName } = command;
    
    // For immediate response, create user directly
    const user = await this.userService.create({ 
      email, 
      password, 
      firstName, 
      lastName 
    });
    
    // Queue additional processing
    await this.userQueueService.addProcessUserDataJob(user.user_id);
    
    this.logger.log(`User created and queued for additional processing: ${user.user_id}`);
    
    return user;
  }
}