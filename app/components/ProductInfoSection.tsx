'use client'

import { useState } from 'react'
import ProductImageCarousel from './ProductImageCarousel'
import ColorSelector from './ColorSelector'

interface ProductInfoSectionProps {
  name: string
  price?: string | null
  description?: string | null
  colors: string[]
  sizes: string[]
  galleryImages: string[]
}

export default function ProductInfoSection({
  name,
  price,
  description,
  colors,
  sizes,
  galleryImages,
}: ProductInfoSectionProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // 为每个颜色生成对应的图片（先用已有图片路径替代）
  // 这里可以根据实际需求，为每个颜色分配不同的图片
  const colorImages: Record<string, string[]> = {}
  colors.forEach((color) => {
    // 为每个颜色使用相同的图片（先用已有图片替代）
    // 后续可以根据实际需求，为每个颜色配置不同的图片
    colorImages[color] = galleryImages.length > 0 ? galleryImages : []
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* 左侧：图片轮播 */}
      <div>
        <ProductImageCarousel
          images={galleryImages}
          selectedColor={selectedColor}
          colorImages={colorImages}
        />
      </div>

      {/* 右侧：商品信息 */}
      <div className="flex flex-col justify-center space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-wider mb-4 text-black">
            {name}
          </h1>
          {price && <p className="text-2xl font-light text-black">{price}</p>}
        </div>

        {/* 颜色选择 */}
        {colors.length > 0 && (
          <ColorSelector
            colors={colors.map((color) => ({ name: color }))}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        )}

        {/* 尺码 */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-light tracking-widest uppercase text-black">
              尺码:
            </span>
            <div className="flex items-center gap-3">
              {sizes.map((size, index) => (
                <span
                  key={index}
                  className="text-sm font-light text-black border border-black px-4 py-2"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 描述 */}
        {description && (
          <p className="text-sm font-light leading-relaxed text-gray-700">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

