import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserService } from 'src/modules/user/services/user.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: CreateUserCommand) {
    const { email, password, firstName, lastName } = command;
    return this.userService.create({ email, password, firstName, lastName });
  }
}