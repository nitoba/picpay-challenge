/* eslint-disable no-new */
import { FakePubSubMessaging } from '@/test/messaging/fake-pubsub-messaging'
import { OnTransactionCreated } from './on-transaction-created'
import { makeTransaction } from '@/test/factories/make-transaction'
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction-repository'
import { waitFor } from '@/test/utils/wait-for'

describe('On Transaction Created Subscriber', () => {
  let pubSubMessaging: FakePubSubMessaging
  let transactionRepository: InMemoryTransactionRepository

  beforeAll(() => {
    transactionRepository = new InMemoryTransactionRepository()
    pubSubMessaging = new FakePubSubMessaging()
    new OnTransactionCreated(pubSubMessaging)
  })

  it('should publish transaction created event', async () => {
    const pubSubMessagingSpy = vi.spyOn(pubSubMessaging, 'publish')
    const transaction = makeTransaction()
    await transactionRepository.save(transaction)

    await waitFor(() => {
      expect(pubSubMessagingSpy).toHaveBeenCalled()
    })
  })
})
