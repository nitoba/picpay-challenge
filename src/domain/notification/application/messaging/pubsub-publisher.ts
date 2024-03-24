export abstract class PubSubPublisher {
  abstract publish(topic: string, payload: string): Promise<void>
}
