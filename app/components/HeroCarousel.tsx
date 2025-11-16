'use client'

import type { CarouselImage } from '../types'
import BaseCarousel from './BaseCarousel'

interface HeroCarouselProps {
  images: CarouselImage[]
  containerClassName?: string
}

export default function HeroCarousel({ images, containerClassName = 'h-screen' }: HeroCarouselProps) {
  // 空状态
  if (images.length === 0) {
    return (
      <div className={`relative w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${containerClassName}`}>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-extralight tracking-widest mb-4 text-gray-700">
              MATTER
            </div>
            <div className="text-6xl md:text-8xl font-extralight tracking-widest text-gray-700">
              TOUCH
            </div>
            <div className="mt-8 text-sm tracking-[0.3em] uppercase text-gray-600">
              个人品牌服饰
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <BaseCarousel
      images={images}
      autoScrollInterval={5000}
      enableAutoScroll={true}
      transitionType="slide"
      containerClassName={containerClassName}
      showArrows={true}
      showIndicators={true}
      indicatorStyle="bars"
      placeholderName="主视觉"
      placeholderTitleSize="lg"
      renderOverlay={() => (
        <>
          {/* 蒙版层 - 确保文字清晰可见 */}
          <div className="absolute inset-0 bg-black/30 z-[5]"></div>
          
          {/* 品牌文字 - 在蒙版上方 */}
          <div className="absolute inset-0 z-[10] w-full h-full flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-extralight tracking-widest mb-4 text-white">
                MATTER
              </div>
              <div className="text-6xl md:text-8xl font-extralight tracking-widest text-white">
                TOUCH
              </div>
              <div className="mt-8 text-sm tracking-[0.3em] uppercase text-white/90">
                个人品牌服饰
              </div>
            </div>
          </div>
        </>
      )}
    />
  )
}

