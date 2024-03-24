import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CostumerRepository } from '@/domain/transaction/application/repositories/costumer-repository'
import { TransactionRepository } from '@/domain/transaction/application/repositories/transaction-repository'
import { PrismaCostumerRepository } from './prisma/repositories/prisma-costumer-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'
import { WalletRepository } from '@/domain/transaction/application/repositories/wallet-repository'
import { PrismaWalletRepository } from './prisma/repositories/prisma-wallet-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CostumerRepository,
      useClass: PrismaCostumerRepository,
    },
    {
      provide: WalletRepository,
      useClass: PrismaWalletRepository,
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [
    PrismaService,
    CostumerRepository,
    WalletRepository,
    TransactionRepository,
  ],
})
export class DatabaseModule {}
