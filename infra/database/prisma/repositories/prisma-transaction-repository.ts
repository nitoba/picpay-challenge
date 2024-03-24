import { TransactionRepository } from '@/domain/transaction/application/repositories/transaction-repository'
import { PrismaService } from '../prisma.service'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(transaction: Transaction): Promise<Transaction> {
    const prismaTransaction = await this.prisma.transaction.create({
      data: {
        amount: transaction.amount,
        description: transaction.description,
        walletId: transaction.walletId.toString(),
      },
    })

    return transaction
  }
}
