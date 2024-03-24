import { Transaction } from '../../enterprise/entities/transaction'

export abstract class TransactionGateway {
  abstract isAuthorizedToTransaction(transaction: Transaction): Promise<boolean>
}
