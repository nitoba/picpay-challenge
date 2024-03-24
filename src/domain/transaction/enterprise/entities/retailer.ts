import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentType } from '../value-objects/document-type'

export interface RetailerProps {
  name: string
  email: string
  documentNumber: string
  documentType: DocumentType
  password: string
}

export class Retailer extends Entity<RetailerProps> {
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

  static create(props: RetailerProps, id?: UniqueEntityID): Retailer {
    return new Retailer(props, id)
  }
}
