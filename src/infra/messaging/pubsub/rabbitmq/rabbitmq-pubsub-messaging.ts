import { PubSubPublisher } from '@/domain/notification/application/messaging/pubsub-publisher'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RabbitMqPubSubMessaging implements PubSubPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(topic: string, payload: string): Promise<void> {
    await this.amqpConnection.publish('transactions', topic, payload)
  }
}
