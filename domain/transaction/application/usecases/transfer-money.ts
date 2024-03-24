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
  payerId: string
  payeeId: string
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
    payerId,
    payeeId,
  }: TransferMoneyRequest): Promise<TransferMoneyResponse> {
    if (amount <= 0) {
      return left(new Error('Amount must be greater than 0'))
    }

    const payerWallet = await this.walletRepository.findByOwnerId(
      new UniqueEntityID(payerId),
    )

    if (!payerWallet) {
      return left(new Error('Payer Wallet not found'))
    }

    if (payerWallet.ownerType !== 'costumer') {
      return left(new Error('Payer is not a Costumer'))
    }

    const payeeWallet = await this.walletRepository.findByOwnerId(
      new UniqueEntityID(payeeId),
    )

    if (!payeeWallet) {
      return left(new Error('Payee Wallet not found'))
    }

    const result = TransferService.transfer(payerWallet, payeeWallet, amount)

    if (result.isLeft()) {
      return left(result.value)
    }

    const transfer = Transfer.create({
      amount,
      sourceWallet: payerWallet,
      dirWallet: payeeWallet,
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
