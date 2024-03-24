import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Costumer } from '../../enterprise/entities/costumer'

export abstract class CostumerRepository {
  abstract findById(id: UniqueEntityID): Promise<Costumer | null>
}
