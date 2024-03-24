import { CostumerRepository } from '@/domain/transaction/application/repositories/costumer-repository'
import { Notification } from '../../enterprise/enterprise/entities/notification'
import { NotificationSender } from '../messaging/notification-sender'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'

interface SendEmailNotificationAboutTransactionUseCaseRequest {
  payeeId: string
  subject: string
  body: string
}

type SendEmailNotificationAboutTransactionUseCaseResponse = Either<
  Error,
  boolean
>

@Injectable()
export class SendEmailNotificationAboutTransactionUseCase {
  constructor(
    private readonly notificationSender: NotificationSender,
    private readonly costumerRepository: CostumerRepository,
  ) {}

  async execute({
    body,
    payeeId,
    subject,
  }: SendEmailNotificationAboutTransactionUseCaseRequest): Promise<SendEmailNotificationAboutTransactionUseCaseResponse> {
    const costumer = await this.costumerRepository.findById(
      new UniqueEntityID(payeeId),
    )

    if (!costumer) {
      return left(new Error('Costumer not found'))
    }

    const notification = Notification.create({
      body,
      subject,
      to: costumer.email,
      type: 'email',
    })
    const result = await this.notificationSender.send(notification)

    return right(result)
  }
}
