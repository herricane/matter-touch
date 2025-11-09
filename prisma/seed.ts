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
      description: '简约设计的成衣单品，采用优质面料制作，展现现代时尚美学。',
      price: 1299.0,
      imageUrl: '/images/collections/clothings/products/product-1.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-1-hover.jpg',
      category: 'clothings',
      colors: JSON.stringify(['黑色', '白色', '灰色']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      composition: '100% 棉',
      care: '手洗，不可漂白，平铺晾干，低温熨烫',
      galleryImages: JSON.stringify([
        '/images/collections/clothings/products/product-1.jpg',
        '/images/collections/clothings/products/product-1-hover.jpg',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/clothings/products/product-1.jpg',
        '/images/collections/clothings/products/product-1-hover.jpg',
        '/images/collections/clothings/products/product-1.jpg',
      ]),
      detailTexts: JSON.stringify([
        '精选优质面料，经过精细工艺处理，呈现出自然质感和舒适触感。每一件都经过严格的质量把控，确保品质卓越。',
        '设计简约而不简单，注重细节与实用性的完美结合。适合日常搭配，展现个人品味与风格。',
        '品牌致力于打造经久耐用的成衣单品，陪伴您度过每一个重要时刻。',
      ]),
    },
    {
      name: '成衣 2',
      description: '经典款成衣，融合传统工艺与现代设计，彰显优雅气质。',
      price: 1399.0,
      imageUrl: '/images/collections/clothings/products/product-2.jpg',
      hoverImageUrl: '/images/collections/clothings/products/product-2-hover.jpg',
      category: 'clothings',
      colors: JSON.stringify(['米色', '卡其色', '驼色']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      composition: '90% 棉, 10% 聚酯纤维',
      care: '手洗，不可漂白，平铺晾干，低温熨烫',
      galleryImages: JSON.stringify([
        '/images/collections/clothings/products/product-2.jpg',
        '/images/collections/clothings/products/product-2-hover.jpg',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/clothings/products/product-2.jpg',
        '/images/collections/clothings/products/product-2-hover.jpg',
        '/images/collections/clothings/products/product-2.jpg',
      ]),
      detailTexts: JSON.stringify([
        '采用优质面料，触感柔软舒适，透气性佳。精心设计的版型，贴合身形，展现优雅轮廓。',
        '细节处体现匠心工艺，每一针每一线都经过精心考量。无论是日常出行还是正式场合，都能完美适配。',
        '品牌坚持可持续理念，选用环保材料，在追求美的同时，也关注对环境的责任。',
      ]),
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
      description: '简约设计的配饰单品，采用优质材料制作，展现现代时尚美学。',
      price: 299.0,
      imageUrl: '/images/collections/accessories/products/product-1.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-1-hover.jpg',
      category: 'accessories',
      colors: JSON.stringify(['黑色', '深灰', '棕色']),
      sizes: JSON.stringify(['均码']),
      composition: '100% 真皮',
      care: '使用软布擦拭，避免接触水和化学品，存放时保持干燥',
      galleryImages: JSON.stringify([
        '/images/collections/accessories/products/product-1.jpg',
        '/images/collections/accessories/products/product-1-hover.jpg',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/accessories/products/product-1.jpg',
        '/images/collections/accessories/products/product-1-hover.jpg',
        '/images/collections/accessories/products/product-1.jpg',
      ]),
      detailTexts: JSON.stringify([
        '精选优质真皮材质，经过精细工艺处理，呈现出自然纹理和质感。每一件都经过严格的质量把控，确保品质卓越。',
        '设计简约而不简单，注重细节与实用性的完美结合。适合日常搭配，展现个人品味与风格。',
        '品牌致力于打造经久耐用的配饰单品，陪伴您度过每一个重要时刻。',
      ]),
    },
    {
      name: '配饰 2',
      description: '经典款配饰，融合传统工艺与现代设计，彰显优雅气质。',
      price: 399.0,
      imageUrl: '/images/collections/accessories/products/product-2.jpg',
      hoverImageUrl: '/images/collections/accessories/products/product-2-hover.jpg',
      category: 'accessories',
      colors: JSON.stringify(['米色', '卡其色', '驼色']),
      sizes: JSON.stringify(['均码']),
      composition: '90% 棉, 10% 聚酯纤维',
      care: '手洗，不可漂白，平铺晾干，低温熨烫',
      galleryImages: JSON.stringify([
        '/images/collections/accessories/products/product-2.jpg',
        '/images/collections/accessories/products/product-2-hover.jpg',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/accessories/products/product-2.jpg',
        '/images/collections/accessories/products/product-2-hover.jpg',
        '/images/collections/accessories/products/product-2.jpg',
      ]),
      detailTexts: JSON.stringify([
        '采用优质面料，触感柔软舒适，透气性佳。精心设计的版型，贴合身形，展现优雅轮廓。',
        '细节处体现匠心工艺，每一针每一线都经过精心考量。无论是日常出行还是正式场合，都能完美适配。',
        '品牌坚持可持续理念，选用环保材料，在追求美的同时，也关注对环境的责任。',
      ]),
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
