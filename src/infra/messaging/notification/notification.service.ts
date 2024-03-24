import { NotificationSender } from '@/domain/notification/application/messaging/notification-sender'
import { Notification } from '@/domain/notification/enterprise/enterprise/entities/notification'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class EmailNotificationService implements NotificationSender {
  private messageBodyValidationSchema = z.object({
    message: z.boolean(),
  })

  constructor(private readonly envService: EnvService) {}
  async send(notification: Notification): Promise<boolean> {
    const res = await fetch(this.envService.get('NOTIFICATION_SERVICE_URL'))

    if (!res.ok) {
      return false
    }

    const validationResult = this.messageBodyValidationSchema.safeParse(
      await res.json(),
    )

    if (!validationResult.success) return false

    if (!validationResult.data.message) return false

    console.log('Notification sent successfully!', notification)

    return true
  }
}
