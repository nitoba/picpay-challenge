import { CostumerRepository } from '@/domain/transaction/application/repositories/costumer-repository'
import { Notification } from '../../enterprise/enterprise/entities/notification'
import { NotificationSender } from '../messaging/notification-sender'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface SendEmailNotificationAboutTransferUseCaseRequest {
  payeeId: string
  subject: string
  body: string
}

export class SendEmailNotificationAboutTransferUseCase {
  constructor(
    private readonly notificationSender: NotificationSender,
    private readonly costumerRepository: CostumerRepository,
  ) {}

  async execute({
    body,
    payeeId,
    subject,
  }: SendEmailNotificationAboutTransferUseCaseRequest): Promise<void> {
    const costumer = await this.costumerRepository.findById(
      new UniqueEntityID(payeeId),
    )

    if (!costumer) {
      return
    }

    const notification = Notification.create({
      body,
      subject,
      to: costumer.email,
      type: 'email',
    })
    await this.notificationSender.send(notification)
  }
}
