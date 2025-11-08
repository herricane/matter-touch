'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { HeroImage } from '../types'

interface HeroCarouselProps {
  images: HeroImage[]
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (images.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000) // 每5秒切换一次

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
    <div className="relative w-full h-screen overflow-hidden">
      {/* 背景图片滚动 */}
      <div className="absolute inset-0">
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((image, idx) => (
            <div
              key={`${image.imageUrl}-${idx}`}
              className="relative min-w-full h-full"
            >
              <Image
                src={image.imageUrl}
                alt={image.name}
                fill
                className="object-cover"
                priority={image === images[0]}
                quality={90}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.className = 'relative min-w-full h-full bg-gradient-to-br from-gray-100 to-gray-200'
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* 蒙版层 - 确保文字清晰可见 */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* 品牌文字 - 在蒙版上方 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
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
      
      {/* 指示器 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1 transition-all duration-300 ${
              index === currentImageIndex
                ? 'w-8 bg-white'
                : 'w-1 bg-white/50'
            }`}
            aria-label={`切换到图片 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

