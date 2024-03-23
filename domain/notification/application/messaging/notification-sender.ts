import { Notification } from '../../enterprise/enterprise/entities/notification'

export abstract class NotificationSender {
  abstract send(notification: Notification): Promise<void>
}
