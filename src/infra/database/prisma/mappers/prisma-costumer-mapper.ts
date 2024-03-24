import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Costumer } from '@/domain/transaction/enterprise/entities/costumer'
import { DocumentType } from '@/domain/transaction/enterprise/value-objects/document-type'
import { User } from '@prisma/client'

export class PrismaCostumerMapper {
  static toDomain(raw: User): Costumer {
    return Costumer.create(
      {
        name: raw.name,
        email: raw.email,
        documentNumber: raw.documentNumber,
        documentType: raw.documentType.toLowerCase() as unknown as DocumentType,
        password: undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
