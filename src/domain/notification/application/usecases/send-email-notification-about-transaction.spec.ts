import { FakeNotificationSender } from '@/test/messaging/fake-notification-sender'
import { SendEmailNotificationAboutTransactionUseCase } from './send-email-notification-about-transaction'
import { InMemoryCostumerRepository } from '@/test/repositories/in-memory-costumer-repository'
import { makeCostumer } from '@/test/factories/make-costumer'

describe('Send Notification UseCase', () => {
  let notificationSender: FakeNotificationSender
  let sendNotificationUseCase: SendEmailNotificationAboutTransactionUseCase
  let costumerRepository: InMemoryCostumerRepository

  beforeEach(() => {
    costumerRepository = new InMemoryCostumerRepository()
    notificationSender = new FakeNotificationSender()
    sendNotificationUseCase = new SendEmailNotificationAboutTransactionUseCase(
      notificationSender,
      costumerRepository,
    )
  })

  it('should send a notification', async () => {
    const notificationSenderSpy = vi.spyOn(notificationSender, 'send')

    const payee = makeCostumer()
    costumerRepository.costumers.push(payee)

    const request = {
      payeeId: payee.id.toString(),
      subject: 'New transaction received',
      body: 'Transaction content',
    }

    await sendNotificationUseCase.execute(request)

    expect(notificationSenderSpy).toHaveBeenCalled()
  })
})
