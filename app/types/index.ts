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
  colors?: string | null  // JSON数组，格式: ["黑色", "白色", "灰色"]
  sizes?: string | null  // JSON数组，格式: ["S", "M", "L", "XL"]
  composition?: string | null
  care?: string | null
  galleryImages?: string | null  // JSON数组，商品详情页的图片集合
  detailTexts?: string | null  // JSON数组，商品详情页的文字描述，对应三张详情图
  detailImages?: string | null  // JSON数组，商品详情页的三张详情图片
  colorImages?: string | null  // JSON对象，格式: {"黑色": ["/path/to/image1.webp", "/path/to/image2.webp"], "白色": [...]}
  createdAt: Date
  updatedAt: Date
}

