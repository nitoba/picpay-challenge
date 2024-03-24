import { DomainEvents } from '@/core/events/domain-events'
import { TransactionRepository } from '@/domain/transaction/application/repositories/transaction-repository'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'

export class InMemoryTransactionRepository implements TransactionRepository {
  transactions: Transaction[] = []

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction)
    DomainEvents.dispatchEventsForAggregate(transaction.id)
  }
}
