import { PubSubMessaging } from '@/domain/notification/application/messaging/pubsub-messaging'
import { Module } from '@nestjs/common'
import { RabbitMqPubSubMessaging } from './pubsub/rabbitmq/rabbitmq-pubsub-messaging'

@Module({
  providers: [
    {
      provide: PubSubMessaging,
      useClass: RabbitMqPubSubMessaging,
    },
  ],
  exports: [PubSubMessaging],
})
export class MessagingModule {}
