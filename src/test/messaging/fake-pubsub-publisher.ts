import { PubSubPublisher } from '@/domain/notification/application/messaging/pubsub-publisher'

export class FakePubSubPublisher implements PubSubPublisher {
  async publish(topic: string, payload: string): Promise<void> {
    console.log(topic, payload)
  }
}
