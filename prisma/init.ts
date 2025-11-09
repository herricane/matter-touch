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
      description: '简约设计的成衣单品，采用优质面料制作，展现现代时尚美学。',
      price: 1299.0,
      imageUrl: '/images/collections/clothings/product-1.webp',
      hoverImageUrl: '/images/collections/clothings/product-1-hover.webp',
      category: 'clothings',
      colors: JSON.stringify(['黑色', '白色', '灰色']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      composition: '100% 棉',
      care: '手洗，不可漂白，平铺晾干，低温熨烫',
      galleryImages: JSON.stringify([
        '/images/collections/clothings/product-1.webp',
        '/images/collections/clothings/product-1-hover.webp',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/clothings/product-1.webp',
        '/images/collections/clothings/product-1-hover.webp',
        '/images/collections/clothings/product-1.webp',
      ]),
      detailTexts: JSON.stringify([
        '精选优质面料，经过精细工艺处理，呈现出自然质感和舒适触感。每一件都经过严格的质量把控，确保品质卓越。',
        '设计简约而不简单，注重细节与实用性的完美结合。适合日常搭配，展现个人品味与风格。',
        '品牌致力于打造经久耐用的成衣单品，陪伴您度过每一个重要时刻。',
      ]),
      colorImages: JSON.stringify({
        黑色: [
          '/images/collections/clothings/product-1/colors/image-b1.webp',
          '/images/collections/clothings/product-1/colors/image-b2.webp',
        ],
        白色: [
          '/images/collections/clothings/product-1/colors/image-w1.webp',
          '/images/collections/clothings/product-1/colors/image-w2.webp',
        ],
        灰色: [
          '/images/collections/clothings/product-1/colors/image-g1.webp',
          '/images/collections/clothings/product-1/colors/image-g2.webp',
        ],
      }),
    },
    {
      name: '成衣 2',
      description: '经典款成衣，融合传统工艺与现代设计，彰显优雅气质。',
      price: 1399.0,
      imageUrl: '/images/collections/clothings/product-2.webp',
      hoverImageUrl: '/images/collections/clothings/product-2-hover.webp',
      category: 'clothings',
      colors: JSON.stringify(['米色', '卡其色', '驼色']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      composition: '90% 棉, 10% 聚酯纤维',
      care: '手洗，不可漂白，平铺晾干，低温熨烫',
      galleryImages: JSON.stringify([
        '/images/collections/clothings/product-2.webp',
        '/images/collections/clothings/product-2-hover.webp',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/clothings/product-2.webp',
        '/images/collections/clothings/product-2-hover.webp',
        '/images/collections/clothings/product-2.webp',
      ]),
      detailTexts: JSON.stringify([
        '采用优质面料，触感柔软舒适，透气性佳。精心设计的版型，贴合身形，展现优雅轮廓。',
        '细节处体现匠心工艺，每一针每一线都经过精心考量。无论是日常出行还是正式场合，都能完美适配。',
        '品牌坚持可持续理念，选用环保材料，在追求美的同时，也关注对环境的责任。',
      ]),
      colorImages: JSON.stringify({
        米色: [
          '/images/collections/clothings/product-2/colors/image-m1.webp',
          '/images/collections/clothings/product-2/colors/image-m2.webp',
        ],
        卡其色: [
          '/images/collections/clothings/product-2/colors/image-c1.webp',
          '/images/collections/clothings/product-2/colors/image-c2.webp',
        ],
        驼色: [
          '/images/collections/clothings/product-2/colors/image-o1.webp',
          '/images/collections/clothings/product-2/colors/image-o2.webp',
        ],
      }),
    },
  ]

  // 创建配饰产品
  const accessoriesProducts = [
    {
      name: '配饰 1',
      description: '简约设计的配饰单品，采用优质材料制作，展现现代时尚美学。',
      price: 299.0,
      imageUrl: '/images/collections/accessories/product-1.webp',
      hoverImageUrl: '/images/collections/accessories/product-1-hover.webp',
      category: 'accessories',
      colors: JSON.stringify(['黑色', '深灰', '棕色']),
      sizes: JSON.stringify(['均码']),
      composition: '100% 真皮',
      care: '使用软布擦拭，避免接触水和化学品，存放时保持干燥',
      galleryImages: JSON.stringify([
        '/images/collections/accessories/product-1.webp',
        '/images/collections/accessories/product-1-hover.webp',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/accessories/product-1.webp',
        '/images/collections/accessories/product-1-hover.webp',
        '/images/collections/accessories/product-1.webp',
      ]),
      detailTexts: JSON.stringify([
        '精选优质真皮材质，经过精细工艺处理，呈现出自然纹理和质感。每一件都经过严格的质量把控，确保品质卓越。',
        '设计简约而不简单，注重细节与实用性的完美结合。适合日常搭配，展现个人品味与风格。',
        '品牌致力于打造经久耐用的配饰单品，陪伴您度过每一个重要时刻。',
      ]),
      colorImages: JSON.stringify({
        黑色: [
          '/images/collections/accessories/product-1/colors/image-b1.webp',
          '/images/collections/accessories/product-1/colors/image-b2.webp',
        ],
        深灰: [
          '/images/collections/accessories/product-1/colors/image-d1.webp',
          '/images/collections/accessories/product-1/colors/image-d2.webp',
        ],
        棕色: [
          '/images/collections/accessories/product-1/colors/image-br1.webp',
          '/images/collections/accessories/product-1/colors/image-br2.webp',
        ],
      }),
    },
    {
      name: '配饰 2',
      description: '经典款配饰，融合传统工艺与现代设计，彰显优雅气质。',
      price: 399.0,
      imageUrl: '/images/collections/accessories/product-2.webp',
      hoverImageUrl: '/images/collections/accessories/product-2-hover.webp',
      category: 'accessories',
      colors: JSON.stringify(['米色', '卡其色', '驼色']),
      sizes: JSON.stringify(['均码']),
      composition: '90% 棉, 10% 聚酯纤维',
      care: '手洗，不可漂白，平铺晾干，低温熨烫',
      galleryImages: JSON.stringify([
        '/images/collections/accessories/product-2.webp',
        '/images/collections/accessories/product-2-hover.webp',
      ]),
      detailImages: JSON.stringify([
        '/images/collections/accessories/product-2.webp',
        '/images/collections/accessories/product-2-hover.webp',
        '/images/collections/accessories/product-2.webp',
      ]),
      detailTexts: JSON.stringify([
        '采用优质面料，触感柔软舒适，透气性佳。精心设计的版型，贴合身形，展现优雅轮廓。',
        '细节处体现匠心工艺，每一针每一线都经过精心考量。无论是日常出行还是正式场合，都能完美适配。',
        '品牌坚持可持续理念，选用环保材料，在追求美的同时，也关注对环境的责任。',
      ]),
      colorImages: JSON.stringify({
        米色: [
          '/images/collections/accessories/product-2/colors/image-m1.webp',
          '/images/collections/accessories/product-2/colors/image-m2.webp',
        ],
        卡其色: [
          '/images/collections/accessories/product-2/colors/image-c1.webp',
          '/images/collections/accessories/product-2/colors/image-c2.webp',
        ],
        驼色: [
          '/images/collections/accessories/product-2/colors/image-o1.webp',
          '/images/collections/accessories/product-2/colors/image-o2.webp',
        ],
      }),
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

