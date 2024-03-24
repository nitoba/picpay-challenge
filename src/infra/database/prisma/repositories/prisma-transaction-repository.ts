import { TransactionRepository } from '@/domain/transaction/application/repositories/transaction-repository'
import { PrismaService } from '../prisma.service'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(transaction: Transaction): Promise<boolean> {
    try {
      await this.prisma.$transaction([
        this.prisma.transition.create({
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
            balance: transaction.sourceWallet.balance,
          },
        }),
        this.prisma.wallet.update({
          where: {
            id: transaction.dirWallet.id.toString(),
          },
          data: {
            balance: transaction.dirWallet.balance,
          },
        }),
      ])
      DomainEvents.dispatchEventsForAggregate(transaction.id)
      return true
    } catch (error) {
      console.log('ERROR: transaction not saved', error)
      return false
    }
  }
}
