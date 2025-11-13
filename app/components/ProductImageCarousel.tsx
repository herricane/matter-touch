'use client'

import BaseCarousel, { type CarouselImage } from './BaseCarousel'
import ImagePlaceholder from './ImagePlaceholder'

interface ProductImageCarouselProps {
  images: string[]
  selectedColor?: string | null
  colorImages?: Record<string, string> // 每个颜色对应的单个图片
  productName?: string // 产品名称，用于 placeholder 显示
}

export default function ProductImageCarousel({
  images,
  selectedColor,
  colorImages,
  productName,
}: ProductImageCarouselProps) {
  // 根据选定的颜色决定显示的图片
  // 如果选择了颜色：
  //   - 有对应的图片（且不为空字符串）：显示该颜色的单个图片
  //   - 没有对应的图片：显示空数组（会触发 placeholder 显示）
  // 如果没有选择颜色：显示默认图片数组
  const displayImages =
    selectedColor
      ? colorImages && colorImages[selectedColor] && colorImages[selectedColor].trim()
        ? [colorImages[selectedColor]]
        : [] // 选择了颜色但没有对应图片，显示空数组以触发 placeholder
      : images

  // 转换为 BaseCarousel 需要的格式
  const carouselImages: CarouselImage[] = displayImages.map((image, idx) => ({
    src: image,
    alt: `商品图片 ${idx + 1}`,
    priority: idx === 0,
  }))

  if (displayImages.length === 0) {
    return (
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        <ImagePlaceholder titleSize="md" name={productName || '产品'} />
      </div>
    )
  }

  return (
    <BaseCarousel
      images={carouselImages}
      autoScrollInterval={selectedColor ? 0 : 4000} // 选择了颜色时禁用自动滚动
      enableAutoScroll={!selectedColor && displayImages.length > 1}
      transitionType="fade"
      containerClassName="aspect-[3/4] bg-gray-50"
      showArrows={true}
      showIndicators={true}
      indicatorStyle="dots"
      placeholderName={productName || '产品'}
      placeholderTitleSize="md"
    />
  )
}

