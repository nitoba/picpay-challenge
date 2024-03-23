/* eslint-disable no-new */
import { FakePubSubMessaging } from '@/test/messaging/fake-pubsub-messaging'
import { OnTransferCreated } from './on-transfer-created'
import { makeTransfer } from '@/test/factories/make-transfer'
import { InMemoryTransferRepository } from '@/test/repositories/in-memory-transfer-repository'
import { waitFor } from '@/test/utils/wait-for'

describe('On Transfer Created Subscriber', () => {
  let pubSubMessaging: FakePubSubMessaging
  let transferRepository: InMemoryTransferRepository

  beforeAll(() => {
    transferRepository = new InMemoryTransferRepository()
    pubSubMessaging = new FakePubSubMessaging()
    new OnTransferCreated(pubSubMessaging)
  })

  it('should publish transfer created event', async () => {
    const pubSubMessagingSpy = vi.spyOn(pubSubMessaging, 'publish')
    const transfer = makeTransfer()
    await transferRepository.save(transfer)

    await waitFor(() => {
      expect(pubSubMessagingSpy).toHaveBeenCalled()
    })
  })
})
