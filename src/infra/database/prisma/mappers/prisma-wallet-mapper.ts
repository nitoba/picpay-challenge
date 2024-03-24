import { Wallet as WalletPrisma } from '@prisma/client'
import {
  OwnerType,
  Wallet,
} from '@/domain/transaction/enterprise/entities/wallet'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaWalletMapper {
  static toDomain(raw: WalletPrisma): Wallet {
    return Wallet.create(
      {
        balance: raw.balance.toNumber(),
        ownerId: new UniqueEntityID(raw.ownerId),
        ownerType: raw.type.toLowerCase() as unknown as OwnerType,
      },
      new UniqueEntityID(raw.id),
    ).value as Wallet
  }
}
