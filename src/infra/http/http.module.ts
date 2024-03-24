import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { TransactionController } from './controllers/transaction.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
})
export class HttpModule {}
