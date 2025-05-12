import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

@Catch()
export class KafkaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc().getContext<KafkaContext>();
    const message = ctx.getMessage();
    const topic = ctx.getTopic();
    const partition = ctx.getPartition();
    const offset = message.offset;

    console.error(`
      Error processing Kafka message:
      Topic: ${topic}
      Partition: ${partition}
      Offset: ${offset}
      Error: ${exception.message}
    `);

  }
}