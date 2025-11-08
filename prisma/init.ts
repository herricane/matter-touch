/**
 * 生产环境初始化脚本
 * 仅在数据库为空时填充初始数据，不会删除现有数据
 * 
 * 使用方法：
 * tsx prisma/init.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('检查数据库状态...')

  // 检查是否已有产品数据
  const existingProducts = await prisma.product.count()

  if (existingProducts > 0) {
    console.log(`数据库已有 ${existingProducts} 个产品，跳过初始化。`)
    console.log('如需重新初始化，请先清空数据库或使用 seed.ts（开发环境）')
    return
  }

  console.log('数据库为空，开始填充初始数据...')

  // 创建成衣产品
  const clothingProducts = [
    {
      name: '成衣 1',
      description: '舒适的成衣产品',
      price: 1299.0,
      imageUrl: '/images/collections/clothings/products/product-1.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-1-hover.jpg',
      category: 'clothings',
    },
    {
      name: '成衣 2',
      description: '时尚的成衣产品',
      price: 1399.0,
      imageUrl: '/images/collections/clothings/products/product-2.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-2-hover.jpg',
      category: 'clothings',
    },
    {
      name: '成衣 3',
      description: '高品质成衣产品',
      price: 1499.0,
      imageUrl: '/images/collections/clothings/products/product-3.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-3-hover.jpg',
      category: 'clothings',
    },
  ]

  // 创建配饰产品
  const accessoriesProducts = [
    {
      name: '配饰 1',
      description: '时尚配饰',
      price: 299.0,
      imageUrl: '/images/collections/accessories/products/product-1.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-1-hover.jpg',
      category: 'accessories',
    },
    {
      name: '配饰 2',
      description: '精美配饰',
      price: 399.0,
      imageUrl: '/images/collections/accessories/products/product-2.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-2-hover.jpg',
      category: 'accessories',
    },
    {
      name: '配饰 3',
      description: '独特配饰',
      price: 499.0,
      imageUrl: '/images/collections/accessories/products/product-3.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-3-hover.jpg',
      category: 'accessories',
    },
  ]

  // 批量创建产品
  await prisma.product.createMany({
    data: [...clothingProducts, ...accessoriesProducts],
  })

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

