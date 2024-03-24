export abstract class PubSubHandler {
  abstract handle(payload: unknown): Promise<unknown>
}
