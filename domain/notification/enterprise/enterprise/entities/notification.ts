import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  subject: string
  to: string
  body: string
  type: 'email' | 'sms'
}

export class Notification extends Entity<NotificationProps> {
  get subject() {
    return this.props.subject
  }

  get to() {
    return this.props.to
  }

  get body() {
    return this.props.body
  }

  get type() {
    return this.props.type
  }

  static create(props: NotificationProps, id?: UniqueEntityID): Notification {
    return new Notification(props, id)
  }
}
