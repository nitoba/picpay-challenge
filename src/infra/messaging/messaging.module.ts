import { PubSubMessaging } from '@/domain/notification/application/messaging/pubsub-messaging'
import { Module } from '@nestjs/common'
import { RabbitMqPubSubMessaging } from './pubsub/rabbitmq/rabbitmq-pubsub-messaging'
import { NotificationSender } from '@/domain/notification/application/messaging/notification-sender'
import { EmailNotificationService } from './notification/notification.service'
import { SendEmailNotificationAboutTransactionUseCase } from '@/domain/notification/application/usecases/send-email-notification-about-transaction'
import { DatabaseModule } from '../database/database.module'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

@Module({
  imports: [
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
      provide: PubSubMessaging,
      useClass: RabbitMqPubSubMessaging,
    },
    {
      provide: NotificationSender,
      useClass: EmailNotificationService,
    },
    SendEmailNotificationAboutTransactionUseCase,
  ],
  exports: [PubSubMessaging, NotificationSender],
})
export class MessagingModule {}
