import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Transaction,
  TransactionProps,
} from '@/domain/transaction/enterprise/entities/transaction'
import { makeWallet } from './make-wallet'

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
): Transaction {
  return Transaction.create(
    {
      amount: Math.round(Math.random() * 100),
      dirWallet: makeWallet(),
      sourceWallet: makeWallet(),
      ...override,
    },
    id,
  )
}
