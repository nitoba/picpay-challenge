import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WalletRepository } from '../repositories/wallet-repository'
import { Transaction } from '../../enterprise/entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'
import { TransactionService } from '../../enterprise/services/transaction-service'
import { TransactionGateway } from '../gateways/transaction-gateway'

type TransferMoneyRequest = {
  amount: number
  payerId: string
  payeeId: string
}

type TransferMoneyResponse = Either<Error, void>

export class TransferMoneyUseCase {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionGateway: TransactionGateway,
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

    const result = TransactionService.transaction(
      payerWallet,
      payeeWallet,
      amount,
    )

    if (result.isLeft()) {
      return left(result.value)
    }

    const transaction = Transaction.create({
      amount,
      sourceWallet: payerWallet,
      dirWallet: payeeWallet,
    })

    const isAuthorizedToTransaction =
      await this.transactionGateway.isAuthorizedToTransaction(transaction)

    if (!isAuthorizedToTransaction) {
      return left(new Error('Unauthorized to transaction'))
    }

    await this.transactionRepository.save(transaction)

    return right(undefined)
  }
}
