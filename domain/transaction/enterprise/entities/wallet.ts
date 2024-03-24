import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InvalidBalanceError } from './errors/invalid-balance-error'

export interface WalletProps {
  ownerId: UniqueEntityID
  ownerType: 'costumer' | 'retailer'
  balance: number
}

export class Wallet extends Entity<WalletProps> {
  get ownerId() {
    return this.props.ownerId
  }

  get balance() {
    return this.props.balance
  }

  get ownerType() {
    return this.props.ownerType
  }

  debit(amount: number): Either<InvalidBalanceError, void> {
    if (this.balance - amount < 0) {
      return left(new InvalidBalanceError('Insufficient funds'))
    }

    this.props.balance -= amount

    return right(undefined)
  }

  credit(amount: number): Either<InvalidBalanceError, void> {
    this.props.balance += amount

    return right(undefined)
  }

  static create(
    props: WalletProps,
    id?: UniqueEntityID,
  ): Either<InvalidBalanceError, Wallet> {
    if (props.balance < 0) {
      return left(new InvalidBalanceError('Balance cannot be less than 0'))
    }

    return right(new Wallet(props, id))
  }
}
