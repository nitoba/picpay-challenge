import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { TransactionController } from './controllers/transaction.controller'
import { TransferMoneyUseCase } from '@/domain/transaction/application/usecases/transfer-money'
import { TransactionGateway } from '@/domain/transaction/application/gateways/transaction-gateway'
import { PicTransactionGateway } from '../gateways/transaction-gateway'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [DatabaseModule, EnvModule],
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
