import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Retailer,
  RetailerProps,
} from '@/domain/transaction/enterprise/entities/retailer'
import { DocumentType } from '@/domain/transaction/enterprise/value-objects/document-type'
import { faker } from '@faker-js/faker'

export function makeRetailer(
  override?: Partial<RetailerProps>,
  id?: UniqueEntityID,
): Retailer {
  return Retailer.create(
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
