import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Wallet } from './wallet'
import { InvalidBalanceError } from './errors/invalid-balance-error'

describe('Wallet', () => {
  it('should create a wallet', () => {
    const result = Wallet.create({
      ownerType: 'costumer',
      ownerId: new UniqueEntityID(),
      balance: 100,
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to create a wallet with a negative balance', () => {
    const result = Wallet.create({
      ownerType: 'costumer',
      ownerId: new UniqueEntityID(),
      balance: -100,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidBalanceError)
  })

  it('should not be able to debit from wallet', () => {
    const wallet = Wallet.create({
      ownerType: 'costumer',
      ownerId: new UniqueEntityID(),
      balance: 100,
    })

    if (wallet.isRight()) {
      const result = wallet.value.debit(200)

      expect(result.isLeft()).toBeTruthy()
    }
  })

  it('should be able to debit from wallet', () => {
    const wallet = Wallet.create({
      ownerType: 'costumer',
      ownerId: new UniqueEntityID(),
      balance: 100,
    })

    if (wallet.isRight()) {
      const result = wallet.value.debit(50)

      expect(result.isRight()).toBeTruthy()
      expect(wallet.value.balance).toBe(50)
    }
  })

  it('should be able to credit to wallet', () => {
    const wallet = Wallet.create({
      ownerType: 'costumer',
      ownerId: new UniqueEntityID(),
      balance: 100,
    })

    if (wallet.isRight()) {
      const result = wallet.value.credit(50)

      expect(result.isRight()).toBeTruthy()
      expect(wallet.value.balance).toBe(150)
    }
  })
})
