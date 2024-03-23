import { TransferGateway } from '@/domain/transaction/application/gateways/transfer-gateway'
import { Transfer } from '@/domain/transaction/enterprise/entities/transfer'

export class FakeTransferGateway implements TransferGateway {
  async isAuthorizedToTransfer(transfer: Transfer): Promise<boolean> {
    console.log(transfer)
    return true
  }
}
