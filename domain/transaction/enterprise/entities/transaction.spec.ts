import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction } from './transaction'
import { Wallet } from './wallet'

describe('Transaction', () => {
  it('should create a transaction', () => {
    const result = Transaction.create({
      amount: 100,
      sourceWallet: Wallet.create({
        ownerType: 'costumer',
        ownerId: new UniqueEntityID(),
        balance: 100,
      }).value as Wallet,
      dirWallet: Wallet.create({
        ownerType: 'costumer',
        ownerId: new UniqueEntityID(),
        balance: 100,
      }).value as Wallet,
    })

    expect(result).toBeInstanceOf(Transaction)
  })
})
