// 系列类型
export interface Collection {
  name: string
  slug: string
  coverImageUrl: string
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
  hoverImageUrl?: string | null  // 悬停时的图片
  category: string
  // 商品详情页字段
  colors?: string | null  // JSON数组
  sizes?: string | null  // JSON数组
  composition?: string | null
  care?: string | null
  galleryImages?: string | null  // JSON数组
  detailTexts?: string | null  // JSON数组
  detailImages?: string | null  // JSON数组
  createdAt: Date
  updatedAt: Date
}

