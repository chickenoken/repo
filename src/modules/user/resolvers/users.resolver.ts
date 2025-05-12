import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../entities/user.entity';
import { GetUsersQuery } from '../repository/queries/get-user-by-id.query';
import { GetUserByIdQuery } from '../repository/queries/get-users.query';
import { CreateUserCommand } from '../repository/commands/create-user.command';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [User])
  async getUsers() {
    return this.queryBus.execute(new GetUsersQuery());
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ) {
    return this.commandBus.execute(
      new CreateUserCommand(email, password, firstName, lastName),
    );
  }
}