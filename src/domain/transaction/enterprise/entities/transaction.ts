import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Wallet } from './wallet'
import { TransactionCreated } from '../events/transaction-created'

export interface TransactionProps {
  amount: number
  sourceWallet: Wallet
  dirWallet: Wallet
}

export class Transaction extends AggregateRoot<TransactionProps> {
  get amount() {
    return this.props.amount
  }

  get sourceWallet() {
    return this.props.sourceWallet
  }

  get dirWallet() {
    return this.props.dirWallet
  }

  static create(props: TransactionProps, id?: UniqueEntityID): Transaction {
    const transaction = new Transaction(
      {
        ...props,
      },
      id,
    )

    const isNewTransaction = !id

    if (isNewTransaction) {
      transaction.addDomainEvent(new TransactionCreated(transaction))
    }

    return transaction
  }
}
