import type { Collection, Product, HeroImage } from '@prisma/client'

// 使用 Prisma 生成的类型，确保类型一致性
export type { Collection, Product, HeroImage }

// 扩展类型：包含关联关系的类型
export type CollectionWithProducts = Collection & {
  products: Product[]
}

export type ProductWithCollection = Product & {
  collection: Collection | null
}

// 轮播图图片类型
export interface CarouselImage {
  src: string
  alt: string
  priority?: boolean
}

