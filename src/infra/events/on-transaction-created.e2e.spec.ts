import { AppModule } from '@/infra/app.module'
import { PrismaCostumerFactory } from '@/test/factories/make-costumer'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { waitFor } from '@/test/utils/wait-for'
// import { MessagingModule } from '../messaging/messaging.module'
import { DatabaseModule } from '../database/database.module'
import { PubSubPublisher } from '@/domain/notification/application/messaging/pubsub-publisher'
import { SendEmailNotificationAboutTransactionUseCase } from '@/domain/notification/application/usecases/send-email-notification-about-transaction'

describe('On Transaction Created (E2E)', () => {
  let app: INestApplication
  let costumerFactory: PrismaCostumerFactory
  let pubSubPublisher: PubSubPublisher
  let sendEmailNotification: SendEmailNotificationAboutTransactionUseCase

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, AppModule],
      providers: [PrismaCostumerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    costumerFactory = moduleRef.get(PrismaCostumerFactory)
    sendEmailNotification = moduleRef.get(
      SendEmailNotificationAboutTransactionUseCase,
    )
    pubSubPublisher = moduleRef.get(PubSubPublisher)

    await app.init()
  })

  test('On Transaction Created Handler', async () => {
    const sendEmailNotificationSpy = vi.spyOn(sendEmailNotification, 'execute')
    const pubSubPublisherSpy = vi.spyOn(pubSubPublisher, 'publish')
    const [payer, payee] = await Promise.all([
      costumerFactory.makeDbCostumer(),
      costumerFactory.makeDbCostumer(),
    ])
    await request(app.getHttpServer()).post('/transactions').send({
      amount: 100,
      payer: payer.id,
      payee: payee.id,
    })

    await waitFor(() => {
      expect(sendEmailNotificationSpy).toHaveBeenCalled()
      expect(pubSubPublisherSpy).toHaveBeenCalled()
    })
  })
})
