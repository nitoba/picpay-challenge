export abstract class PubSubMessaging {
  abstract publish(topic: string, payload: string): Promise<void>
}
