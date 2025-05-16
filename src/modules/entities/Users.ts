import { Entity, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Users {
  [PrimaryKeyProp]?: 'userId';

  @PrimaryKey({ type: 'mediumint' })
  userId!: number;

  @Property({
    type: 'string',
    nullable: true,
    index: 'user_email',
    unique: 'user_email_2',
  })
  userEmail?: string = '';

  @Property({ type: 'string', nullable: true })
  userPassword?: string = '';

  @Property({ type: 'string', length: 128, nullable: true })
  userFirstName?: string = '';

  @Property({ type: 'string', length: 128, nullable: true })
  userLastName?: string = '';

  @Property({ type: 'integer', unsigned: true, nullable: true })
  userCreated?: number = 0;

  @Property({ type: 'integer', unsigned: true, nullable: true })
  userLastLogin?: number = 0;
}
