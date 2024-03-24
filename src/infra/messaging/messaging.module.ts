import { PubSubPublisher } from '@/domain/notification/application/messaging/pubsub-publisher'
import { Module } from '@nestjs/common'
import { RabbitMqPubSubMessaging } from './pubsub/rabbitmq/rabbitmq-pubsub-messaging'
import { NotificationSender } from '@/domain/notification/application/messaging/notification-sender'
import { EmailNotificationService } from './notification/notification.service'
import { SendEmailNotificationAboutTransactionUseCase } from '@/domain/notification/application/usecases/send-email-notification-about-transaction'
import { DatabaseModule } from '../database/database.module'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { PubSubHandler } from '@/domain/notification/application/messaging/pubsub-handler'
import { RabbitMqPubSubHandler } from './pubsub/rabbitmq/rabbitmq-pubsub-handler'

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => ({
        uri: env.get('RABBIT_MQ_URI'),
        queues: [
          {
            name: 'transaction-created',
            exchange: 'transactions',
            routingKey: 'transaction-created',
            createQueueIfNotExists: true,
          },
        ],
        exchanges: [
          {
            name: 'transactions',
            type: 'direct',
            createExchangeIfNotExists: true,
          },
        ],
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  providers: [
    {
      provide: PubSubPublisher,
      useClass: RabbitMqPubSubMessaging,
    },
    {
      provide: PubSubHandler,
      useClass: RabbitMqPubSubHandler,
    },
    {
      provide: NotificationSender,
      useClass: EmailNotificationService,
    },
    SendEmailNotificationAboutTransactionUseCase,
  ],
  exports: [PubSubPublisher, PubSubHandler, NotificationSender],
})
export class MessagingModule {}
