import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@Entity({ tableName: 'users' })
@ObjectType()
export class User {
  @PrimaryKey({ name: 'user_id', type: 'integer', autoincrement: true })
  @Field(() => ID)
  user_id: number;

  @Property({ name: 'user_email' })
  @Field()
  email: string;

  @Property({ name: 'user_password' })
  password: string;

  @Property({ name: 'user_first_name' })
  @Field()
  firstName: string;

  @Property({ name: 'user_last_name' })
  @Field()
  lastName: string;

  @Property({ 
    name: 'user_created', 
    type: 'integer'
  })
  @Field(() => Int)
  createdAt: number;

  @Property({ 
    name: 'user_last_login', 
    type: 'integer', 
    nullable: true 
  })
  @Field(() => Int, { nullable: true })
  lastLogin?: number; 
}