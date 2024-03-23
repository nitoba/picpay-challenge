import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transfer } from './transfer'
import { Wallet } from './wallet'

describe('Transfer', () => {
  it('should create a transfer', () => {
    const result = Transfer.create({
      amount: 100,
      sourceWallet: Wallet.create({
        ownerId: new UniqueEntityID(),
        balance: 100,
      }).value as Wallet,
      dirWallet: Wallet.create({
        ownerId: new UniqueEntityID(),
        balance: 100,
      }).value as Wallet,
      status: 'pending',
    })

    expect(result).toBeInstanceOf(Transfer)
  })
})
