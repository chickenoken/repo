import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../get-user-by-id.query';
import { UserService } from 'src/modules/user/services/user.service';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userService: UserService) {}

  async execute() {
    return this.userService.findAll();
  }
}