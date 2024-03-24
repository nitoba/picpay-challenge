import { PubSubHandler } from '@/domain/notification/application/messaging/pubsub-handler'
import { SendEmailNotificationAboutTransactionUseCase } from '@/domain/notification/application/usecases/send-email-notification-about-transaction'
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class RabbitMqPubSubHandler implements PubSubHandler {
  constructor(
    private readonly sendEmailNotification: SendEmailNotificationAboutTransactionUseCase,
  ) {}

  private payloadSchema = z.object({
    id: z.string().uuid(),
    amount: z.number(),
    sourceWallet: z.object({
      id: z.string().uuid(),
      ownerId: z.string().uuid(),
    }),
    destWallet: z.object({
      id: z.string().uuid(),
      ownerId: z.string().uuid(),
    }),
  })

  @RabbitSubscribe({
    exchange: 'transactions',
    routingKey: 'transaction-created',
    queue: 'transaction-created',
  })
  async handle(payload: unknown) {
    const message = this.payloadSchema.safeParse(JSON.parse(payload as string))

    if (!message.success) {
      return new Nack(true)
    }

    const result = await this.sendEmailNotification.execute({
      subject: 'New Transaction Received',
      body: `You Received a new transfer from ${(
        message.data.amount * 100
      ).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}`,
      payeeId: message.data.destWallet.ownerId,
    })

    if (result.isLeft()) {
      // eslint-disable-next-line no-new
      return new Nack(true)
    }
  }
}
