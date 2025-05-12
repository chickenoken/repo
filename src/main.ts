import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Create the HTTP app
  const app = await NestFactory.create(AppModule);
  
  // Connect the Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
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
  });
  
  // Start microservices
  await app.startAllMicroservices();
  logger.log('Kafka microservice started');
  
  // Start HTTP server
  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(err => {
  console.error('Error starting application:', err);
  process.exit(1);
});