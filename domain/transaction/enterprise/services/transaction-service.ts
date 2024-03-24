import { Either, left, right } from '@/core/either'
import { Wallet } from '../entities/wallet'

export class TransactionService {
  static transaction(
    sourceWallet: Wallet,
    dirWallet: Wallet,
    amount: number,
  ): Either<Error, void> {
    if (amount <= 0) {
      return left(new Error('Amount must be greater than 0'))
    }

    if (sourceWallet.balance < amount) {
      return left(new Error('Insufficient balance'))
    }

    const debitResult = sourceWallet.debit(amount)
    const creditResult = dirWallet.credit(amount)

    if (debitResult.isLeft() || creditResult.isLeft()) {
      return left(new Error('Error while transferring money'))
    }

    return right(undefined)
  }
}
