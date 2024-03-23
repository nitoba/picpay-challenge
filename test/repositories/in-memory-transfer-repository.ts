import { DomainEvents } from '@/core/events/domain-events'
import { TransferRepository } from '@/domain/transaction/application/repositories/transfer-repository'
import { Transfer } from '@/domain/transaction/enterprise/entities/transfer'

export class InMemoryTransferRepository implements TransferRepository {
  transfers: Transfer[] = []

  async save(transfer: Transfer): Promise<void> {
    this.transfers.push(transfer)
    DomainEvents.dispatchEventsForAggregate(transfer.id)
  }
}
