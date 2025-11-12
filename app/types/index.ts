// 系列类型
export interface Collection {
  id: string
  name: string
  slug: string
  coverImageUrl?: string | null
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

// 主视觉图片类型
export interface HeroImage {
  name: string
  imageUrl: string
}

// 产品类型（与 Prisma 模型对应）
export interface Product {
  id: string
  name: string
  description?: string | null
  price?: number | null
  imageUrl?: string | null
  hoverImageUrl?: string | null
  // 商品详情页字段
  colors?: string | null
  sizes?: string | null
  composition?: string | null
  care?: string | null
  galleryImages?: string | null
  detailTexts?: string | null
  detailImages?: string | null
  colorImages?: string | null
  collectionId: string
  collection?: Collection | null
  createdAt: Date
  updatedAt: Date
}

