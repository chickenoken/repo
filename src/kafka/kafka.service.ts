import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  async onModuleInit() {
    const topics = ['test-topic'];
    
    topics.forEach(topic => {
      this.client.subscribeToResponseOf(topic);
    });
    
    await this.client.connect();
  }

  async publish(topic: string, message: any) {
    return this.client.emit(topic, {
      key: Date.now().toString(),
      value: JSON.stringify(message),
    });
  }

  async send(topic: string, message: any) {
    return this.client.send(topic, {
      key: Date.now().toString(),
      value: JSON.stringify(message),
    });
  }
}