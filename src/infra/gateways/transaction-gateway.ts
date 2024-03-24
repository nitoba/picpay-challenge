import { TransactionGateway } from '@/domain/transaction/application/gateways/transaction-gateway'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PicTransactionGateway implements TransactionGateway {
  async isAuthorizedToTransaction(transaction: Transaction): Promise<boolean> {
    console.log('isAuthorizedToTransaction', transaction)
    return true
  }
}
