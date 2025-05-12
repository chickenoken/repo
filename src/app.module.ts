import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { KafkaModule } from './kafka/kafka.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/mikro-orm.config';
import { UsersModule } from './modules/user/user.module';
import { RedisCacheModule } from './config/redis.config';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    QueueModule,
    RedisCacheModule,
    KafkaModule,
    UsersModule
  ],
})
export class AppModule {}
