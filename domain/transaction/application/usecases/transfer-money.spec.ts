import { InMemoryWalletRepository } from '@/test/repositories/in-memory-wallet-repository'
import { TransferMoneyUseCase } from './transfer-money'
import { InMemoryCostumerRepository } from '@/test/repositories/in-memory-costumer-repository'
import { InMemoryTransferRepository } from '@/test/repositories/in-memory-transfer-repository'
import { makeCostumer } from '@/test/factories/make-costumer'
import { makeWallet } from '@/test/factories/make-wallet'
import { FakeTransferGateway } from '@/test/gateways/fake-transfer-gateway'

describe('Transfer Money UseCase', () => {
  let useCase: TransferMoneyUseCase
  let walletRepository: InMemoryWalletRepository
  let costumerRepository: InMemoryCostumerRepository
  let transferRepository: InMemoryTransferRepository
  let transferGateway: FakeTransferGateway
  beforeEach(() => {
    walletRepository = new InMemoryWalletRepository()
    costumerRepository = new InMemoryCostumerRepository()
    transferRepository = new InMemoryTransferRepository()
    transferGateway = new FakeTransferGateway()
    useCase = new TransferMoneyUseCase(
      costumerRepository,
      walletRepository,
      transferRepository,
      transferGateway,
    )
  })

  it('should not be able to transfer money if amount is not valid', async () => {
    const result = await useCase.execute({
      amount: 0,
      payer: 'invalid-id',
      payee: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Amount must be greater than 0'))
  })

  it('should not be able to transfer money if costumer not exists', async () => {
    const result = await useCase.execute({
      amount: 100,
      payer: 'invalid-id',
      payee: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Costumer not found'))
  })

  it('should not be able to transfer money if wallet costumer not exists', async () => {
    const costumer = makeCostumer()
    costumerRepository.costumers.push(costumer)
    const result = await useCase.execute({
      amount: 100,
      payer: costumer.id.toString(),
      payee: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Costumer Wallet not found'))
  })

  it('should not be able to transfer money if wallet payee not exists', async () => {
    const costumer = makeCostumer()
    const wallet = makeWallet({ ownerId: costumer.id })
    walletRepository.wallets.push(wallet)
    costumerRepository.costumers.push(costumer)
    const result = await useCase.execute({
      amount: 100,
      payer: costumer.id.toString(),
      payee: 'valid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toEqual(new Error('Dir Wallet not found'))
  })

  it('should not be able to transfer money if gateway was not authorized', async () => {
    const transferGatewaySpy = vi.spyOn(
      transferGateway,
      'isAuthorizedToTransfer',
    )

    transferGatewaySpy.mockResolvedValueOnce(false)

    const costumer = makeCostumer()
    const payee = makeCostumer()
    const sourceWallet = makeWallet({ ownerId: costumer.id, balance: 100 })
    const dirWallet = makeWallet({ ownerId: payee.id, balance: 100 })
    walletRepository.wallets.push(...[sourceWallet, dirWallet])
    costumerRepository.costumers.push(...[costumer, payee])

    const result = await useCase.execute({
      amount: 100,
      payer: costumer.id.toString(),
      payee: payee.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new Error('Unauthorized to transfer'))
  })

  it('should able to transfer money', async () => {
    const costumer = makeCostumer()
    const payee = makeCostumer()
    const sourceWallet = makeWallet({ ownerId: costumer.id, balance: 100 })
    const dirWallet = makeWallet({ ownerId: payee.id, balance: 100 })
    walletRepository.wallets.push(...[sourceWallet, dirWallet])
    costumerRepository.costumers.push(...[costumer, payee])

    const result = await useCase.execute({
      amount: 100,
      payer: costumer.id.toString(),
      payee: payee.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(transferRepository.transfers).toHaveLength(1)
    expect(transferRepository.transfers[0].amount).toBe(100)
    expect(transferRepository.transfers[0].sourceWallet.balance).toBe(0)
    expect(transferRepository.transfers[0].dirWallet.balance).toBe(200)
  })
})
