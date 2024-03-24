import { Either, left, right } from '@/core/either'
import { Wallet } from '../entities/wallet'
import { Transaction } from '../entities/transaction'

export class TransactionService {
  static makeTransaction(
    sourceWallet: Wallet,
    dirWallet: Wallet,
    amount: number,
  ): Either<Error, Transaction> {
    if (amount <= 0) {
      return left(new Error('Amount must be greater than 0'))
    }

    if (sourceWallet.balance < amount) {
      return left(new Error('Insufficient balance'))
    }

    if (sourceWallet.ownerType !== 'costumer') {
      return left(new Error('Payer is not a Costumer'))
    }

    const debitResult = sourceWallet.debit(amount)
    const creditResult = dirWallet.credit(amount)

    if (debitResult.isLeft() || creditResult.isLeft()) {
      this.rollbackTransaction(sourceWallet, dirWallet, amount)
      return left(new Error('Error while transferring money'))
    }

    return right(
      Transaction.create({
        amount,
        sourceWallet,
        dirWallet,
      }),
    )
  }

  static rollbackTransaction(
    sourceWallet: Wallet,
    dirWallet: Wallet,
    amount: number,
  ): void {
    sourceWallet.credit(amount)
    dirWallet.debit(amount)
  }
}
