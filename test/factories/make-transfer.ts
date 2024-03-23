import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Transfer,
  TransferProps,
} from '@/domain/transaction/enterprise/entities/transfer'
import { makeWallet } from './make-wallet'

export function makeTransfer(
  override: Partial<TransferProps> = {},
  id?: UniqueEntityID,
): Transfer {
  return Transfer.create(
    {
      amount: Math.round(Math.random() * 100),
      dirWallet: makeWallet(),
      sourceWallet: makeWallet(),
      ...override,
    },
    id,
  )
}
