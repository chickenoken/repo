import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nestjs-app',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'nestjs-consumer',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
  controllers: [KafkaController],
})
export class KafkaModule {}
