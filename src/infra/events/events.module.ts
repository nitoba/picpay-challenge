import { OnTransactionCreated } from '@/domain/notification/application/subscribers/on-transaction-created'
import { Module } from '@nestjs/common'
import { MessagingModule } from '../messaging/messaging.module'

@Module({
  imports: [MessagingModule],
  providers: [OnTransactionCreated],
})
export class EventsModule {}
