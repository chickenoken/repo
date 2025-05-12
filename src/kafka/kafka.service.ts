import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  async onModuleInit() {
    // Required topics
    const topics = ['test-topic'];
    
    // Subscribe to response topics
    topics.forEach(topic => {
      this.client.subscribeToResponseOf(topic);
    });
    
    await this.client.connect();
  }

  // Send a message without expecting a response
  async publish(topic: string, message: any) {
    return this.client.emit(topic, {
      key: Date.now().toString(),
      value: JSON.stringify(message),
    });
  }

  // Send a message and expect a response
  async send(topic: string, message: any) {
    return this.client.send(topic, {
      key: Date.now().toString(),
      value: JSON.stringify(message),
    });
  }
}