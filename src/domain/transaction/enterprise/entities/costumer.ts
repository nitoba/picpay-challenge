import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentType } from '../value-objects/document-type'

export interface CostumerProps {
  name: string
  email: string
  documentNumber: string
  documentType: DocumentType
  password: string
}

export class Costumer extends Entity<CostumerProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get documentNumber() {
    return this.props.documentNumber
  }

  get documentType() {
    return this.props.documentType
  }

  get password() {
    return this.props.password
  }

  static create(props: CostumerProps, id?: UniqueEntityID): Costumer {
    return new Costumer(props, id)
  }
}
