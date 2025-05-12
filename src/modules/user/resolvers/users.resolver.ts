import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly userService: UserService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ): Promise<User> {
    const user = await this.userService.create({
      email,
      password,
      firstName,
      lastName,
    });

    this.kafkaClient.emit('user-events', {
      event: 'USER_CREATED',
      data: {
        id: user.user_id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        createdAtISO: new Date(user.createdAt * 1000).toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

    return user;
  }
}