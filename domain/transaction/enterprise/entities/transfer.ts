import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Wallet } from './wallet'
import { TransferCreated } from '../events/transfer-created'

export interface TransferProps {
  amount: number
  sourceWallet: Wallet
  dirWallet: Wallet
}

export class Transfer extends AggregateRoot<TransferProps> {
  get amount() {
    return this.props.amount
  }

  get sourceWallet() {
    return this.props.sourceWallet
  }

  get dirWallet() {
    return this.props.dirWallet
  }

  static create(props: TransferProps, id?: UniqueEntityID): Transfer {
    const transfer = new Transfer(
      {
        ...props,
      },
      id,
    )

    const isNewTransfer = !id

    if (isNewTransfer) {
      transfer.addDomainEvent(new TransferCreated(transfer))
    }

    return transfer
  }
}
