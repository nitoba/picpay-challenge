import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CostumerRepository } from '@/domain/transaction/application/repositories/costumer-repository'
import { Costumer } from '@/domain/transaction/enterprise/entities/costumer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCostumerMapper } from '../mappers/prisma-costumer-mapper'

@Injectable()
export class PrismaCostumerRepository implements CostumerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: UniqueEntityID): Promise<Costumer | null> {
    const costumer = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    })

    return costumer ? PrismaCostumerMapper.toDomain(costumer) : null
  }
}
