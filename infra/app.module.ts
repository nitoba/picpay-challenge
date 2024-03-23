import { Module } from '@nestjs/common'
import { TransactionController } from './http/controllers/transaction.controller'

@Module({
  imports: [],
  controllers: [TransactionController],
})
export class AppModule {}
