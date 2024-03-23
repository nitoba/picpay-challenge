import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Wallet } from '../entities/wallet'
import { TransferService } from './transfer-service'

describe('Transfer Service', () => {
  it('should transfer money', () => {
    const sourceWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 100,
    }).value as Wallet
    const dirWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 200,
    }).value as Wallet

    const result = TransferService.transfer(sourceWallet, dirWallet, 50)

    expect(result.isRight()).toBeTruthy()
    expect(sourceWallet.balance).toBe(50)
    expect(dirWallet.balance).toBe(250)
  })

  it('should not be able to transfer money if insufficient balance', () => {
    const sourceWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 10,
    }).value as Wallet
    const dirWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 200,
    }).value as Wallet

    const result = TransferService.transfer(sourceWallet, dirWallet, 50)

    expect(result.isLeft()).toBeTruthy()
    expect(sourceWallet.balance).toBe(10)
    expect(dirWallet.balance).toBe(200)
  })

  it('should not be able to transfer money if amount is not valid', () => {
    const sourceWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 10,
    }).value as Wallet
    const dirWallet = Wallet.create({
      ownerId: new UniqueEntityID(),
      balance: 200,
    }).value as Wallet

    let result = TransferService.transfer(sourceWallet, dirWallet, 0)
    expect(result.isLeft()).toBeTruthy()

    result = TransferService.transfer(sourceWallet, dirWallet, -10)
    expect(result.isLeft()).toBeTruthy()

    expect(sourceWallet.balance).toBe(10)
    expect(dirWallet.balance).toBe(200)
  })
})
