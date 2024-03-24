import { ValueObject } from '@/core/entities/value-objects'

type DocumentTypeProps = {
  value: 'CPF' | 'CNPJ'
}

export class DocumentType extends ValueObject<DocumentTypeProps> {
  get value() {
    return this.props.value
  }

  static create(props: DocumentTypeProps): DocumentType {
    return new DocumentType(props)
  }
}
