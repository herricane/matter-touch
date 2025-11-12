import { PrismaClient } from '@prisma/client'
import { seedData, formatForPrisma } from './data'

const prisma = new PrismaClient()

async function main() {
  console.log('开始填充种子数据...')

  // 清空现有数据（注意顺序，先删产品再删系列）
  await prisma.product.deleteMany()
  await prisma.collection.deleteMany()

  const collections = formatForPrisma(seedData)

  for (const collection of collections) {
    await prisma.collection.create({
      data: {
        name: collection.name,
        slug: collection.slug,
        coverImageUrl: collection.coverImageUrl,
        products: {
          create: collection.products,
        },
      },
    })
  }

  console.log('种子数据填充完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
