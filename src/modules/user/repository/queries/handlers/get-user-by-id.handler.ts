import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../get-users.query';
import { UserService } from 'src/modules/user/services/user.service';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserByIdQuery) {
    return this.userService.findOne(query.id);
  }
}