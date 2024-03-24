/* eslint-disable no-new */
import { FakePubSubPublisher } from '@/test/messaging/fake-pubsub-publisher'
import { OnTransactionCreated } from './on-transaction-created'
import { makeTransaction } from '@/test/factories/make-transaction'
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction-repository'
import { waitFor } from '@/test/utils/wait-for'

describe('On Transaction Created Subscriber', () => {
  let pubSubMessaging: FakePubSubPublisher
  let transactionRepository: InMemoryTransactionRepository

  beforeAll(() => {
    transactionRepository = new InMemoryTransactionRepository()
    pubSubMessaging = new FakePubSubPublisher()
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
