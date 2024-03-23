import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CostumerRepository } from '@/domain/transaction/application/repositories/costumer-repository'
import { Costumer } from '@/domain/transaction/enterprise/entities/costumer'

export class InMemoryCostumerRepository implements CostumerRepository {
  costumers: Costumer[] = []

  async findById(id: UniqueEntityID): Promise<Costumer | null> {
    const costumer = this.costumers.find((c) => c.id.equals(id))

    return costumer || null
  }
}
