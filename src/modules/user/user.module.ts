import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { UsersResolver } from './resolvers/users.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './repository/commands/handlers/create-user.handler';
import { GetUsersHandler } from './repository/queries/handlers/get-users.handler';
import { GetUserByIdHandler } from './repository/queries/handlers/get-user-by-id.handler';
import { RedisCacheModule } from 'src/config/redis.config';
import { QueueModule } from '../queue/queue.module';
import { Users } from 'src/modules/entities/Users';

@Module({
  imports: [
    CqrsModule,
    RedisCacheModule,
    QueueModule,
    MikroOrmModule.forFeature([Users]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    UserService,
    UsersResolver,
    CreateUserHandler,
    GetUsersHandler,
    GetUserByIdHandler,
  ],
  exports: [UserService],
})
export class UsersModule {}