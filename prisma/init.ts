/**
 * 生产环境初始化脚本
 * 仅在数据库为空时填充初始数据，不会删除现有数据
 * 
 * 使用方法：
 * tsx prisma/init.ts
 */

import { PrismaClient } from '@prisma/client'
import { seedData, formatForPrisma } from './data'

const prisma = new PrismaClient()

async function main() {
  console.log('检查数据库状态...')

  const existingProducts = await prisma.product.count()
  if (existingProducts > 0) {
    console.log(`数据库已有 ${existingProducts} 个产品，跳过初始化。`)
    console.log('如需重新初始化，请先清空数据库或使用 seed.ts（开发环境）')
    return
  }

  console.log('数据库为空，开始填充初始数据...')

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

  const totalProducts = await prisma.product.count()
  console.log(`✅ 初始化完成！已创建 ${totalProducts} 个产品。`)
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败：', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
