import { PubSubMessaging } from '@/domain/notification/application/messaging/pubsub-messaging'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RabbitMqPubSubMessaging implements PubSubMessaging {
  async publish(topic: string, payload: string): Promise<void> {
    console.log('Publishing to topic', topic, 'with payload', payload)
  }
}
