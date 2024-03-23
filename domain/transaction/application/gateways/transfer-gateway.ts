import { Transfer } from '../../enterprise/entities/transfer'

export abstract class TransferGateway {
  abstract isAuthorizedToTransfer(transfer: Transfer): Promise<boolean>
}
