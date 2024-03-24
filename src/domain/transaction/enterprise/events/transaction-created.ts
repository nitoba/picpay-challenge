import { DomainEvent } from '@/core/events/domain-event'
import { Transaction } from '../entities/transaction'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class TransactionCreated implements DomainEvent {
  ocurredAt: Date
  transaction: Transaction
  constructor(transaction: Transaction) {
    this.ocurredAt = new Date()
    this.transaction = transaction
  }

  getAggregateId(): UniqueEntityID {
    return this.transaction.id
  }
}
