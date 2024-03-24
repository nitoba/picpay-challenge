import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { TransactionController } from './controllers/transaction.controller'
import { TransferMoneyUseCase } from '@/domain/transaction/application/usecases/transfer-money'
import { TransactionGateway } from '@/domain/transaction/application/gateways/transaction-gateway'
import { PicTransactionGateway } from '../gateways/transaction-gateway'

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
  providers: [
    TransferMoneyUseCase,
    {
      provide: TransactionGateway,
      useClass: PicTransactionGateway,
    },
  ],
})
export class HttpModule {}
