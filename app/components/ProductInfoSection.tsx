'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ProductImageCarousel from './ProductImageCarousel'
import ColorSelector from './ColorSelector'

interface ProductInfoSectionProps {
  productId: string
  name: string
  price?: string | null
  description?: string | null
  colors: string[]
  sizes: string[]
  galleryImages: string[]
  colorImagesMap?: Record<string, string> // 每个颜色对应单个图片
}

export default function ProductInfoSection({
  productId,
  name,
  price,
  description,
  colors,
  sizes,
  galleryImages,
  colorImagesMap,
}: ProductInfoSectionProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('加入购物车')
  const [isSuccess, setIsSuccess] = useState(false)

  // 使用传入的颜色图片映射
  // 如果 colorImagesMap 中没有某个颜色的图片，该颜色将不会在 colorImages 中，组件会回退到显示默认图片
  const colorImages: Record<string, string> = colorImagesMap || {}

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        // 错误情况保持原按钮文字和颜色
        setButtonText('加入购物车')
        setIsSuccess(false)
      } else {
        // 成功：按钮文字改为"添加成功"，颜色变为绿色
        setButtonText('添加成功')
        setIsSuccess(true)
        // 1.5秒后恢复为"加入购物车"和原颜色
        setTimeout(() => {
          setButtonText('加入购物车')
          setIsSuccess(false)
        }, 1500)
      }
    } catch (error) {
      // 错误情况保持原按钮文字和颜色
      setButtonText('加入购物车')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* 左侧：图片轮播 */}
      <div>
        <ProductImageCarousel
          images={galleryImages}
          selectedColor={selectedColor}
          colorImages={colorImages}
          productName={name}
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
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`text-sm font-light border px-4 py-2 transition-colors ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'text-black border-black hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
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

        {/* 数量选择 */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-light tracking-widest uppercase text-black">
            数量:
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="text-sm font-light text-black w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-gray-300 text-black hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* 加入购物车按钮 */}
        <div className="pt-4">
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`w-full py-3 border font-light tracking-widest uppercase transition-all duration-300 ease-in-out ${
              isSuccess
                ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                : 'border-black text-black hover:bg-black hover:text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="transition-opacity duration-300">{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

