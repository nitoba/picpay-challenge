import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Wallet } from '../../enterprise/entities/wallet'

export abstract class WalletRepository {
  abstract findByOwnerId(id: UniqueEntityID): Promise<Wallet | null>
}
