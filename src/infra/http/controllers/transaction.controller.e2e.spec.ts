import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCostumerFactory } from '@/test/factories/make-costumer'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Transaction Controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let costumerFactory: PrismaCostumerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaCostumerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    costumerFactory = moduleRef.get(PrismaCostumerFactory)

    await app.init()
  })

  test('[POST] /transactions', async () => {
    const [payer, payee] = await Promise.all([
      costumerFactory.makeDbCostumer(),
      costumerFactory.makeDbCostumer(),
    ])
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 100,
        payer: payer.id,
        payee: payee.id,
      })
    expect(response.statusCode).toBe(201)

    const transactions = await prisma.transition.findMany({
      include: {
        destinationWallet: true,
        sourceWallet: true,
      },
    })

    expect(transactions).toHaveLength(1)
    expect(transactions[0].sourceWallet.ownerId).toBe(payer.id)
    expect(transactions[0].sourceWallet.balance.toNumber()).toBe(9_00)
    expect(transactions[0].destinationWallet.ownerId).toBe(payee.id)
    expect(transactions[0].destinationWallet.balance.toNumber()).toBe(11_00)
  })
})
