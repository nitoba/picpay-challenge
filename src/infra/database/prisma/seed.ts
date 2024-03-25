import { makeCostumer } from '@/test/factories/make-costumer'
import { makeWallet } from '@/test/factories/make-wallet'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const [costumer1, costumer2] = [makeCostumer(), makeCostumer()]
  const [wallet1, wallet2] = [
    makeWallet({
      ownerId: costumer1.id,
      balance: 10_00,
    }),
    makeWallet({
      ownerId: costumer2.id,
      balance: 10_00,
    }),
  ]
  await Promise.all([
    prisma.user.create({
      data: {
        documentNumber: costumer1.documentNumber,
        email: costumer1.email,
        name: costumer1.name,
        password: costumer1.password,
        documentType: costumer1.documentType.value,
        walletId: wallet1.id.toString(),
        wallet: {
          create: {
            id: wallet1.id.toString(),
            type: 'Costumer',
            balance: wallet1.balance,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        documentNumber: costumer2.documentNumber,
        email: costumer2.email,
        name: costumer2.name,
        password: costumer2.password,
        documentType: costumer2.documentType.value,
        walletId: wallet2.id.toString(),
        wallet: {
          create: {
            id: wallet2.id.toString(),
            type: 'Costumer',
            balance: wallet2.balance,
          },
        },
      },
    }),
  ])
}

main()
  .then(async () => {
    console.log('Seed applied with successfully!')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
