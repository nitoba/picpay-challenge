import { PubSubMessaging } from '@/domain/notification/application/messaging/pubsub-messaging'

export class FakePubSubMessaging implements PubSubMessaging {
  async publish(topic: string, payload: string): Promise<void> {
    console.log(topic, payload)
  }
}
