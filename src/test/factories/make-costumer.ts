import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Costumer,
  CostumerProps,
} from '@/domain/transaction/enterprise/entities/costumer'
import { DocumentType } from '@/domain/transaction/enterprise/value-objects/document-type'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { makeWallet } from './make-wallet'

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

@Injectable()
export class PrismaCostumerFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeDbCostumer(override?: Partial<CostumerProps>, id?: UniqueEntityID) {
    const costumer = makeCostumer(override, id)
    const wallet = makeWallet({
      ownerId: costumer.id,
      balance: 10_00,
    })
    const prismaCostumer = await this.prisma.user.create({
      data: {
        documentNumber: costumer.documentNumber,
        email: costumer.email,
        name: costumer.name,
        password: costumer.password,
        documentType: costumer.documentType.value,
        walletId: wallet.id.toString(),
        wallet: {
          create: {
            id: wallet.id.toString(),
            type: 'Costumer',
            balance: wallet.balance,
          },
        },
      },
    })
    return prismaCostumer
  }
}
