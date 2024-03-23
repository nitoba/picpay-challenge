import { NotificationSender } from '@/domain/notification/application/messaging/notification-sender'
import { Notification } from '@/domain/notification/enterprise/enterprise/entities/notification'

export class FakeNotificationSender implements NotificationSender {
  async send(notification: Notification): Promise<void> {
    console.log(notification)
  }
}
