import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { TransferCreated } from '@/domain/transaction/enterprise/events/transfer-created'
import { PubSubMessaging } from '../messaging/pubsub-messaging'

export class OnTransferCreated implements EventHandler {
  constructor(private readonly pubSubMessaging: PubSubMessaging) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleTransferCreated.bind(this),
      TransferCreated.name,
    )
  }

  private async handleTransferCreated({
    transfer,
  }: TransferCreated): Promise<void> {
    const payload = {
      id: transfer.id.toString(),
      amount: transfer.amount,
      sourceWallet: {
        id: transfer.sourceWallet.id.toString(),
        ownerId: transfer.sourceWallet.ownerId.toString(),
      },
      destWallet: {
        id: transfer.dirWallet.id.toString(),
        ownerId: transfer.dirWallet.ownerId.toString(),
      },
    }

    await this.pubSubMessaging.publish(
      'transfer-created',
      JSON.stringify(payload),
    )
  }
}
