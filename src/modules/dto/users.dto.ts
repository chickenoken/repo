import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field(() => Int)
  userId: number;

  @Field()
  userEmail: string;

  @Field({ nullable: true })
  userFirstName?: string;

  @Field({ nullable: true })
  userLastName?: string;

  @Field(() => Int, { nullable: true })
  userCreated?: number;

  @Field(() => Int, { nullable: true })
  userLastLogin?: number;
}