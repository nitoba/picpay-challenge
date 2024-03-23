import { Transfer } from '../../enterprise/entities/transfer'

export abstract class TransferRepository {
  abstract save(transfer: Transfer): Promise<void>
}
