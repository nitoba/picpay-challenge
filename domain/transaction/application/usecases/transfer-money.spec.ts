import { InMemoryWalletRepository } from '@/test/repositories/in-memory-wallet-repository'
import { TransferMoneyUseCase } from './transfer-money'
import { InMemoryCostumerRepository } from '@/test/repositories/in-memory-costumer-repository'
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction-repository'
import { makeCostumer } from '@/test/factories/make-costumer'
import { makeWallet } from '@/test/factories/make-wallet'
import { FakeTransactionGateway } from '@/test/gateways/fake-transaction-gateway'
import { makeRetailer } from '@/test/factories/make-retailer'

describe('Transaction Money UseCase', () => {
  let useCase: TransferMoneyUseCase
  let walletRepository: InMemoryWalletRepository
  let costumerRepository: InMemoryCostumerRepository
  let transactionRepository: InMemoryTransactionRepository
  let transactionGateway: FakeTransactionGateway
  beforeEach(() => {
    walletRepository = new InMemoryWalletRepository()
    costumerRepository = new InMemoryCostumerRepository()
    transactionRepository = new InMemoryTransactionRepository()
    transactionGateway = new FakeTransactionGateway()
    useCase = new TransferMoneyUseCase(
      walletRepository,
      transactionRepository,
      transactionGateway,
    )
  })

  it('should not be able to transaction money if amount is not valid', async () => {
    const result = await useCase.execute({
      amount: 0,
      payerId: 'invalid-id',
      payeeId: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Amount must be greater than 0'))
  })

  it('should not be able to transaction money if payer wallet not exists', async () => {
    const result = await useCase.execute({
      amount: 100,
      payerId: 'invalid-id',
      payeeId: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Payer Wallet not found'))
  })

  it('should not be able to transaction money if wallet payee not exists', async () => {
    const costumer = makeCostumer()
    const wallet = makeWallet({ ownerId: costumer.id })
    walletRepository.wallets.push(wallet)
    costumerRepository.costumers.push(costumer)
    const result = await useCase.execute({
      amount: 100,
      payerId: costumer.id.toString(),
      payeeId: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Payee Wallet not found'))
  })

  it('should not be able to transaction money if gateway was not authorized', async () => {
    const transactionGatewaySpy = vi.spyOn(
      transactionGateway,
      'isAuthorizedToTransaction',
    )

    transactionGatewaySpy.mockResolvedValueOnce(false)

    const costumer = makeCostumer()
    const payee = makeCostumer()
    const sourceWallet = makeWallet({ ownerId: costumer.id, balance: 100 })
    const dirWallet = makeWallet({ ownerId: payee.id, balance: 100 })
    walletRepository.wallets.push(...[sourceWallet, dirWallet])
    costumerRepository.costumers.push(...[costumer, payee])

    const result = await useCase.execute({
      amount: 100,
      payerId: costumer.id.toString(),
      payeeId: payee.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new Error('Unauthorized to transaction'))
  })

  it('should not be able to transaction money from retailer payer', async () => {
    const costumer = makeRetailer()
    const payee = makeCostumer()
    const sourceWallet = makeWallet({
      ownerId: costumer.id,
      balance: 100,
      ownerType: 'retailer',
    })
    const dirWallet = makeWallet({ ownerId: payee.id, balance: 100 })
    walletRepository.wallets.push(...[sourceWallet, dirWallet])
    costumerRepository.costumers.push(...[costumer, payee])

    const result = await useCase.execute({
      amount: 100,
      payerId: costumer.id.toString(),
      payeeId: payee.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should able to transaction money', async () => {
    const costumer = makeCostumer()
    const payee = makeCostumer()
    const sourceWallet = makeWallet({ ownerId: costumer.id, balance: 100 })
    const dirWallet = makeWallet({ ownerId: payee.id, balance: 100 })
    walletRepository.wallets.push(...[sourceWallet, dirWallet])
    costumerRepository.costumers.push(...[costumer, payee])

    const result = await useCase.execute({
      amount: 100,
      payerId: costumer.id.toString(),
      payeeId: payee.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(transactionRepository.transactions).toHaveLength(1)
    expect(transactionRepository.transactions[0].amount).toBe(100)
    expect(transactionRepository.transactions[0].sourceWallet.balance).toBe(0)
    expect(transactionRepository.transactions[0].dirWallet.balance).toBe(200)
  })
})
