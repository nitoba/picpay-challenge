import { TransferMoneyUseCase } from '@/domain/transaction/application/usecases/transfer-money'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const transactionBodySchema = z.object({
  payer: z.string().uuid(),
  payee: z.string().uuid(),
  amount: z.number().positive(),
})

const bodyValidationPipe = new ZodValidationPipe(transactionBodySchema)

type TransactionBodySchema = z.infer<typeof transactionBodySchema>

@Controller('/transactions')
export class TransactionController {
  constructor(private readonly transferMoneyUseCase: TransferMoneyUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body(bodyValidationPipe) data: TransactionBodySchema) {
    const result = await this.transferMoneyUseCase.execute({
      amount: data.amount,
      payerId: data.payer,
      payeeId: data.payee,
    })

    if (result.isLeft()) {
      console.log(result.value)
      throw new BadRequestException(result.value)
    }

    if (result.isRight()) {
      return {
        message: 'Transferred successfully',
      }
    }
  }
}
