import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Retailer,
  RetailerProps,
} from '@/domain/transaction/enterprise/entities/retailer'
import { DocumentType } from '@/domain/transaction/enterprise/value-objects/document-type'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { makeWallet } from './make-wallet'

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

@Injectable()
export class PrismaRetailerFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeDbRetailer(override?: Partial<RetailerProps>, id?: UniqueEntityID) {
    const retailer = makeRetailer(override, id)
    const wallet = makeWallet({
      ownerId: retailer.id,
      balance: 10_00,
    })
    const prismaRetailer = await this.prisma.user.create({
      data: {
        documentNumber: retailer.documentNumber,
        email: retailer.email,
        name: retailer.name,
        password: retailer.password,
        documentType: retailer.documentType.value,
        walletId: wallet.id.toString(),
        wallet: {
          create: {
            id: wallet.id.toString(),
            type: 'Retailer',
            balance: wallet.balance,
          },
        },
      },
    })
    return prismaRetailer
  }
}
