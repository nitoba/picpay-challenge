import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Wallet } from '../entities/wallet'
import { TransactionService } from './transaction-service'

describe('Transaction Service', () => {
  it('should transaction money', () => {
    const sourceWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 100,
      ownerType: 'costumer',
    }).value as Wallet
    const dirWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 200,
      ownerType: 'costumer',
    }).value as Wallet

    const result = TransactionService.transaction(sourceWallet, dirWallet, 50)

    expect(result.isRight()).toBeTruthy()
    expect(sourceWallet.balance).toBe(50)
    expect(dirWallet.balance).toBe(250)
  })

  it('should not be able to transaction money if insufficient balance', () => {
    const sourceWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      ownerType: 'costumer',
      balance: 10,
    }).value as Wallet
    const dirWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      ownerType: 'costumer',
      balance: 200,
    }).value as Wallet

    const result = TransactionService.transaction(sourceWallet, dirWallet, 50)

    expect(result.isLeft()).toBeTruthy()
    expect(sourceWallet.balance).toBe(10)
    expect(dirWallet.balance).toBe(200)
  })

  it('should not be able to transaction money if amount is not valid', () => {
    const sourceWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      ownerType: 'costumer',
      balance: 10,
    }).value as Wallet
    const dirWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      ownerType: 'costumer',
      balance: 200,
    }).value as Wallet

    let result = TransactionService.transaction(sourceWallet, dirWallet, 0)
    expect(result.isLeft()).toBeTruthy()

    result = TransactionService.transaction(sourceWallet, dirWallet, -10)
    expect(result.isLeft()).toBeTruthy()

    expect(sourceWallet.balance).toBe(10)
    expect(dirWallet.balance).toBe(200)
  })
})
