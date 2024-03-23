import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Wallet,
  WalletProps,
} from '@/domain/transaction/enterprise/entities/wallet'

export function makeWallet(
  override?: Partial<WalletProps>,
  id?: UniqueEntityID,
): Wallet {
  return Wallet.create(
    {
      balance: Math.round(Math.random() * 100),
      ownerId: new UniqueEntityID(),
      ...override,
    },
    id,
  ).value as Wallet
}
