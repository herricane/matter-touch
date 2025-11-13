'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import ImagePlaceholder from './ImagePlaceholder'

// 轮播箭头组件
interface CarouselArrowProps {
  direction: 'left' | 'right'
  onClick: () => void
  ariaLabel: string
}

function CarouselArrow({ direction, onClick, ariaLabel }: CarouselArrowProps) {
  const isLeft = direction === 'left'

  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/30 hover:bg-white/50 transition-colors z-20 pointer-events-auto"
      style={isLeft ? { left: '1rem' } : { right: '1rem' }}
      aria-label={ariaLabel}
    >
      <svg
        className="w-4 h-4 text-black"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={isLeft ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  )
}

export interface CarouselImage {
  src: string
  alt: string
  priority?: boolean
}

interface BaseCarouselProps {
  images: CarouselImage[]
  autoScrollInterval?: number // 自动滚动间隔（毫秒），0 或 undefined 表示禁用
  enableAutoScroll?: boolean // 是否启用自动滚动
  transitionType?: 'fade' | 'slide' // 过渡类型：淡入淡出或滑动
  containerClassName?: string // 容器类名
  showArrows?: boolean // 是否显示箭头
  showIndicators?: boolean // 是否显示指示器
  indicatorStyle?: 'dots' | 'bars' // 指示器样式
  onImageError?: (index: number, e: React.SyntheticEvent<HTMLImageElement>) => void // 图片加载错误回调
  onIndexChange?: (index: number) => void // 索引变化回调
  renderOverlay?: () => ReactNode // 自定义覆盖层
  renderImage?: (image: CarouselImage, index: number, isActive: boolean) => ReactNode // 自定义图片渲染
  placeholderName?: string // 图片加载失败时显示的占位符名称
  placeholderTitleSize?: 'sm' | 'md' | 'lg' // 占位符文字大小
}

export default function BaseCarousel({
  images,
  autoScrollInterval = 0,
  enableAutoScroll = true,
  transitionType = 'fade',
  containerClassName = '',
  showArrows = true,
  showIndicators = true,
  indicatorStyle = 'dots',
  onImageError,
  onIndexChange,
  renderOverlay,
  renderImage,
  placeholderName,
  placeholderTitleSize = 'md',
}: BaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errorMap, setErrorMap] = useState<Record<number, boolean>>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 重置自动滚动计时器
  const resetAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 启动自动滚动
  const startAutoScroll = useCallback(() => {
    if (!enableAutoScroll || images.length <= 1 || !autoScrollInterval || autoScrollInterval <= 0) {
      resetAutoScroll()
      return
    }

    resetAutoScroll()
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoScrollInterval)
  }, [images.length, enableAutoScroll, autoScrollInterval, resetAutoScroll])

  // 自动滚动效果
  useEffect(() => {
    startAutoScroll()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [startAutoScroll])

  // 通知索引变化
  useEffect(() => {
    onIndexChange?.(currentIndex)
  }, [currentIndex, onIndexChange])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    resetAutoScroll()
    startAutoScroll()
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    resetAutoScroll()
    startAutoScroll()
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
    resetAutoScroll()
    startAutoScroll()
  }

  if (images.length === 0) {
    return <div className={`relative w-full ${containerClassName}`} />
  }

  const isSlide = transitionType === 'slide'

  return (
    <div className={`relative w-full overflow-hidden ${containerClassName}`}>
      {/* 图片容器 */}
      <div className="relative w-full h-full">
        {isSlide ? (
          // 滑动模式
          <div
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, idx) => {
              const hasError = errorMap[idx]
              return (
                <div key={`${image.src}-${idx}`} className="relative min-w-full h-full">
                  {hasError && placeholderName ? (
                    <ImagePlaceholder
                      titleSize={placeholderTitleSize}
                      name={placeholderName}
                    />
                  ) : renderImage ? (
                    renderImage(image, idx, idx === currentIndex)
                  ) : (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={image.priority || idx === 0}
                      quality={90}
                      onError={(e) => {
                        setErrorMap((prev) => {
                          if (prev[idx]) return prev
                          return { ...prev, [idx]: true }
                        })
                        onImageError?.(idx, e)
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          // 淡入淡出模式
          images.map((image, index) => {
            const isActive = index === currentIndex
            const hasError = errorMap[index]
            return (
              <div
                key={`${image.src}-${index}`}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {hasError && placeholderName ? (
                  <ImagePlaceholder
                    titleSize={placeholderTitleSize}
                    name={placeholderName}
                  />
                ) : renderImage ? (
                  renderImage(image, index, isActive)
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={image.priority || index === 0}
                    quality={90}
                    onError={(e) => {
                      setErrorMap((prev) => {
                        if (prev[index]) return prev
                        return { ...prev, [index]: true }
                      })
                      onImageError?.(index, e)
                    }}
                  />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* 左右箭头 */}
      {showArrows && images.length > 1 && (
        <>
          <CarouselArrow direction="left" onClick={goToPrevious} ariaLabel="上一张" />
          <CarouselArrow direction="right" onClick={goToNext} ariaLabel="下一张" />
        </>
      )}

      {/* 自定义覆盖层 */}
      {renderOverlay && renderOverlay()}

      {/* 指示器 */}
      {showIndicators && images.length > 1 && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex space-x-2 z-10 ${
            indicatorStyle === 'bars' ? 'bottom-8' : 'bottom-4'
          }`}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={
                indicatorStyle === 'bars'
                  ? `h-1 transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-white' : 'w-1 bg-white/50'
                    }`
                  : `w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-black w-6'
                        : 'bg-black/30 hover:bg-black/50'
                    }`
              }
              aria-label={`跳转到图片 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

