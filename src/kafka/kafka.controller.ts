import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaController {
  @MessagePattern('test-topic')
  handleTestTopic(@Payload() message: any) {
    console.log('Received message:', message.value);
    
    return { processed: true };
  }
}