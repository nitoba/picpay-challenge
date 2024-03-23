import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WalletRepository } from '@/domain/transaction/application/repositories/wallet-repository'
import { Wallet } from '@/domain/transaction/enterprise/entities/wallet'

export class InMemoryWalletRepository implements WalletRepository {
  wallets: Wallet[] = []

  async findByOwnerId(id: UniqueEntityID): Promise<Wallet | null> {
    const wallet = this.wallets.find((w) => w.ownerId.equals(id))

    return wallet || null
  }
}
