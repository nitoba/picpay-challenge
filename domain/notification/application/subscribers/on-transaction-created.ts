import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { TransactionCreated } from '@/domain/transaction/enterprise/events/transaction-created'
import { PubSubMessaging } from '../messaging/pubsub-messaging'

export class OnTransactionCreated implements EventHandler {
  constructor(private readonly pubSubMessaging: PubSubMessaging) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleTransactionCreated.bind(this),
      TransactionCreated.name,
    )
  }

  private async handleTransactionCreated({
    transaction,
  }: TransactionCreated): Promise<void> {
    const payload = {
      id: transaction.id.toString(),
      amount: transaction.amount,
      sourceWallet: {
        id: transaction.sourceWallet.id.toString(),
        ownerId: transaction.sourceWallet.ownerId.toString(),
      },
      destWallet: {
        id: transaction.dirWallet.id.toString(),
        ownerId: transaction.dirWallet.ownerId.toString(),
      },
    }

    await this.pubSubMessaging.publish(
      'transaction-created',
      JSON.stringify(payload),
    )
  }
}
