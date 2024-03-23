import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Costumer,
  CostumerProps,
} from '@/domain/transaction/enterprise/entities/costumer'
import { DocumentType } from '@/domain/transaction/enterprise/value-objects/document-type'
import { faker } from '@faker-js/faker'

export function makeCostumer(
  override?: Partial<CostumerProps>,
  id?: UniqueEntityID,
): Costumer {
  return Costumer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      documentNumber: faker.number
        .int({ min: 11111111111, max: 99999999999 })
        .toString(),
      documentType: DocumentType.create({ value: 'CPF' }),
      ...override,
    },
    id,
  )
}
