import { TransactionGateway } from '@/domain/transaction/application/gateways/transaction-gateway'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { z } from 'zod'

@Injectable()
export class PicTransactionGateway implements TransactionGateway {
  private validationBody = z.object({
    message: z.string(),
  })

  constructor(private readonly envService: EnvService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isAuthorizedToTransaction(_transaction: Transaction): Promise<boolean> {
    const res = await fetch(
      this.envService.get('PIC_AUTHORIZE_TRANSACTION_GATEWAY_URL'),
    )

    if (!res.ok) {
      return false
    }

    const data = this.validationBody.parse(await res.json())

    const { message } = data

    if (message !== 'Autorizado') {
      return false
    }

    return true
  }
}
