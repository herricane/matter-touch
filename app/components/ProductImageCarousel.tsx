'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import ImagePlaceholder from './ImagePlaceholder'

interface ProductImageCarouselProps {
  images: string[]
  selectedColor?: string | null
  colorImages?: Record<string, string[]> // 每个颜色对应的图片数组
  productName?: string // 产品名称，用于 placeholder 显示
}

export default function ProductImageCarousel({
  images,
  selectedColor,
  colorImages,
  productName,
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errorMap, setErrorMap] = useState<Record<number, boolean>>({})

  // 根据选定的颜色决定显示的图片
  const displayImages =
    selectedColor && colorImages && colorImages[selectedColor]
      ? colorImages[selectedColor]
      : images

  // 自动滚动 - 只在没有选定颜色时启用
  useEffect(() => {
    if (selectedColor || displayImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }, 4000) // 每4秒切换一次

    return () => clearInterval(interval)
  }, [displayImages.length, selectedColor])

  // 当颜色改变或图片源变化时，重置状态
  useEffect(() => {
    setCurrentIndex(0)
    setErrorMap({})
  }, [selectedColor, displayImages])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  if (displayImages.length === 0) {
    return (
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        <ImagePlaceholder titleSize="md" name={productName} />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
      {/* 图片容器 */}
      <div className="relative w-full h-full">
        {displayImages.map((image, index) => {
          const hasError = errorMap[index]
          const isActive = index === currentIndex

          return (
            <div
              key={`${image}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {!hasError ? (
                <Image
                  src={image}
                  alt={`商品图片 ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  onError={() =>
                    setErrorMap((prev) => ({
                      ...prev,
                      [index]: true,
                    }))
                  }
                />
              ) : (
                <ImagePlaceholder titleSize="md" name={productName} />
              )}
            </div>
          )
        })}
      </div>

      {/* 左右箭头 - 只在有多张图片时显示 */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white transition-colors z-10"
            aria-label="上一张"
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white transition-colors z-10"
            aria-label="下一张"
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* 指示器 */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-black w-6'
                  : 'bg-black/30 hover:bg-black/50'
              }`}
              aria-label={`跳转到图片 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

