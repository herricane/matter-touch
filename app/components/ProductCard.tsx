'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '../types'
import ImagePlaceholder from './ImagePlaceholder'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [hoverImageError, setHoverImageError] = useState(false)
  const [shouldLoadHover, setShouldLoadHover] = useState(false)
  const hasHoverImage = product.hoverImageUrl && product.imageUrl && !hoverImageError

  // 延迟加载悬停图片，只在鼠标接近时加载
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (product.hoverImageUrl && !shouldLoadHover) {
      setShouldLoadHover(true)
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="group cursor-pointer block">
      <div
        className="relative w-full aspect-[3/4] bg-gray-100 mb-4 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.imageUrl && !imageError ? (
          <>
            {/* 默认图片 */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 ${
                isHovered && hasHoverImage ? 'opacity-0' : 'opacity-100'
              }`}
              quality={75}
              loading="lazy"
              onError={() => setImageError(true)}
            />
            {/* 悬停图片（延迟加载） */}
            {hasHoverImage && shouldLoadHover && !hoverImageError && (
              <Image
                src={product.hoverImageUrl!}
                alt={`${product.name} - 悬停视图`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                quality={75}
                loading="lazy"
                onError={() => setHoverImageError(true)}
              />
            )}
            {(isHovered && hoverImageError && !imageError) && (
              <ImagePlaceholder titleSize="sm" name={product.name} />
            )}
          </>
        ) : (
          <ImagePlaceholder titleSize="sm" name={product.name} />
        )}
      </div>
      <div className="text-center">
        <h3 className="text-sm font-light tracking-widest uppercase text-black">
          {product.name}
        </h3>
      </div>
    </Link>
  )
}

