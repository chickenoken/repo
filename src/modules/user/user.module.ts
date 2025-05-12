import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
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
  providers: [UserService, UsersResolver],
  exports: [UserService],
})
export class UsersModule {}