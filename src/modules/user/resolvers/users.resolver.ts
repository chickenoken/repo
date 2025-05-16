import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '../repository/queries/get-user-by-id.query';
import { GetUserByIdQuery } from '../repository/queries/get-users.query';
import { CreateUserCommand } from '../repository/commands/create-user.command';
import { UserDto } from 'src/modules/dto/users.dto';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [UserDto])
  async getUsers() {
    return this.queryBus.execute(new GetUsersQuery());
  }

  @Query(() => UserDto, { nullable: true })
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Mutation(() => UserDto)
  async createUser(
    @Args('userEmail') userEmail: string,
    @Args('userPassword') userPassword: string,
    @Args('userFirstName') userFirstName: string,
    @Args('userLastName') userLastName: string,
  ) {
    return this.commandBus.execute(
      new CreateUserCommand(
        userEmail,
        userPassword,
        userFirstName,
        userLastName,
      ),
    );
  }
}
