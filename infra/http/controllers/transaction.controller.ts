import { Controller, Post } from '@nestjs/common'

@Controller('/transactions')
export class TransactionController {
  @Post()
  handle() {
    return {
      message: 'Hello World!',
    }
  }
}
