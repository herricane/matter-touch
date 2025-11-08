import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始填充种子数据...')

  // 清空现有数据
  await prisma.product.deleteMany()

  // 创建成衣产品
  const clothingProducts = [
    {
      name: '成衣 1',
      imageUrl: '/images/collections/clothings/products/product-1.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-1-hover.jpg',
      category: 'clothings',
    },
    {
      name: '成衣 2',
      imageUrl: '/images/collections/clothings/products/product-2.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-2-hover.jpg',
      category: 'clothings',
    },
    {
      name: '成衣 3',
      imageUrl: '/images/collections/clothings/products/product-3.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-3-hover.jpg',
      category: 'clothings',
    },
  ]

  for (const product of clothingProducts) {
    await prisma.product.create({
      data: product,
    })
  }

  // 创建配饰产品
  const accessoriesProducts = [
    {
      name: '配饰 1',
      imageUrl: '/images/collections/accessories/products/product-1.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-1-hover.jpg',
      category: 'accessories',
    },
    {
      name: '配饰 2',
      imageUrl: '/images/collections/accessories/products/product-2.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-2-hover.jpg',
      category: 'accessories',
    },
    {
      name: '配饰 3',
      imageUrl: '/images/collections/accessories/products/product-3.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-3-hover.jpg',
      category: 'accessories',
    },
  ]

  for (const product of accessoriesProducts) {
    await prisma.product.create({
      data: product,
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
