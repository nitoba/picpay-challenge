import { Either, left, right } from '@/core/either'
import { CostumerRepository } from '../repositories/costumer-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WalletRepository } from '../repositories/wallet-repository'
import { Transfer } from '../../enterprise/entities/transfer'
import { TransferRepository } from '../repositories/transfer-repository'
import { TransferService } from '../../enterprise/services/transfer-service'
import { TransferGateway } from '../gateways/transfer-gateway'

type TransferMoneyRequest = {
  amount: number
  payer: string
  payee: string
}

type TransferMoneyResponse = Either<Error, void>

export class TransferMoneyUseCase {
  constructor(
    private readonly costumerRepository: CostumerRepository,
    private readonly walletRepository: WalletRepository,
    private readonly transferRepository: TransferRepository,
    private readonly transferGateway: TransferGateway,
  ) {}

  async execute({
    amount,
    payer,
    payee,
  }: TransferMoneyRequest): Promise<TransferMoneyResponse> {
    if (amount <= 0) {
      return left(new Error('Amount must be greater than 0'))
    }

    const costumer = await this.costumerRepository.findById(
      new UniqueEntityID(payer),
    )

    if (!costumer) {
      return left(new Error('Costumer not found'))
    }

    const costumerWallet = await this.walletRepository.findByOwnerId(
      costumer.id,
    )

    if (!costumerWallet) {
      return left(new Error('Costumer Wallet not found'))
    }

    const dirWallet = await this.walletRepository.findByOwnerId(
      new UniqueEntityID(payee),
    )

    if (!dirWallet) {
      return left(new Error('Dir Wallet not found'))
    }

    const result = TransferService.transfer(costumerWallet, dirWallet, amount)

    if (result.isLeft()) {
      return left(result.value)
    }

    const transfer = Transfer.create({
      amount,
      sourceWallet: costumerWallet,
      dirWallet,
    })

    const isAuthorizedToTransfer =
      await this.transferGateway.isAuthorizedToTransfer(transfer)

    if (!isAuthorizedToTransfer) {
      return left(new Error('Unauthorized to transfer'))
    }

    await this.transferRepository.save(transfer)

    return right(undefined)
  }
}
