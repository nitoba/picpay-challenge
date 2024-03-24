import { Transaction } from '../../enterprise/entities/transaction'

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): Promise<boolean>
}
