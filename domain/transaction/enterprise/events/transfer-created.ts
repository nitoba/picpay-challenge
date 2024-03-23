import { DomainEvent } from '@/core/events/domain-event'
import { Transfer } from '../entities/transfer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class TransferCreated implements DomainEvent {
  ocurredAt: Date
  transfer: Transfer
  constructor(transfer: Transfer) {
    this.ocurredAt = new Date()
    this.transfer = transfer
  }

  getAggregateId(): UniqueEntityID {
    return this.transfer.id
  }
}
