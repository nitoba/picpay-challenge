import { TransactionRepository } from '@/domain/transaction/application/repositories/transaction-repository'
import { PrismaService } from '../prisma.service'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(transaction: Transaction): Promise<boolean> {
    try {
      await this.prisma.$transaction([
        this.prisma.transaction.create({
          data: {
            id: transaction.id.toString(),
            amount: transaction.amount,
            sourceWalletId: transaction.sourceWallet.id.toString(),
            destinationWalletId: transaction.dirWallet.id.toString(),
          },
        }),
        this.prisma.wallet.update({
          where: {
            id: transaction.sourceWallet.id.toString(),
          },
          data: {
            balance: transaction.sourceWallet.balance - transaction.amount,
          },
        }),
        this.prisma.wallet.update({
          where: {
            id: transaction.dirWallet.id.toString(),
          },
          data: {
            balance: transaction.dirWallet.balance + transaction.amount,
          },
        }),
      ])
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
