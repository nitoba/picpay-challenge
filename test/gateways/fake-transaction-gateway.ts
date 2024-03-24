import { TransactionGateway } from '@/domain/transaction/application/gateways/transaction-gateway'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'

export class FakeTransactionGateway implements TransactionGateway {
  async isAuthorizedToTransaction(transaction: Transaction): Promise<boolean> {
    console.log(transaction)
    return true
  }
}
