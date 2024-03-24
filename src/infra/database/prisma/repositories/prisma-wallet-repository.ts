import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WalletRepository } from '@/domain/transaction/application/repositories/wallet-repository'
import { Wallet } from '@/domain/transaction/enterprise/entities/wallet'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaWalletMapper } from '../mappers/prisma-wallet-mapper'

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByOwnerId(id: UniqueEntityID): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        ownerId: id.toString(),
      },
    })

    return wallet ? PrismaWalletMapper.toDomain(wallet) : null
  }
}
