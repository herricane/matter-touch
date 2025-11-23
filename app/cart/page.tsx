'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

interface CartItem {
  id: string
  quantity: number
  selectedColor: string | null
  selectedSize: string | null
  product: {
    id: string
    name: string
    price: number | null
    imageUrl: string | null
    collection: {
      slug: string
    }
  }
}

interface Cart {
  id: string
  items: CartItem[]
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchCart()
    }
  }, [status, router])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error('获取购物车失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      deleteItem(itemId)
      return
    }

    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('更新数量失败:', error)
    } finally {
      setUpdating(null)
    }
  }

  const deleteItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setUpdating(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar showHomeLink />
        <div className="pt-32 pb-16 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm font-light text-gray-600">加载中...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar showHomeLink />
        <div className="pt-32 pb-16 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extralight tracking-wider mb-8 text-black">
              购物车
            </h1>
            <p className="text-sm font-light text-gray-600 mb-8">
              购物车是空的
            </p>
            <Link
              href="/"
              className="inline-block text-sm font-light tracking-widest uppercase text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
            >
              继续购物
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + (item.product.price || 0) * item.quantity
  }, 0)

  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />
      <div className="pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extralight tracking-wider mb-12 text-black">
            购物车
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 购物车商品列表 */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* 商品图片 */}
                    <Link
                      href={`/products/${item.product.id}`}
                      className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 relative"
                    >
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 128px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          无图片
                        </div>
                      )}
                    </Link>

                    {/* 商品信息 */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="text-lg font-light text-black hover:opacity-60 transition-opacity"
                        >
                          {item.product.name}
                        </Link>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {item.selectedColor && (
                              <span>颜色: {item.selectedColor}</span>
                            )}
                            {item.selectedColor && item.selectedSize && (
                              <span className="mx-2">|</span>
                            )}
                            {item.selectedSize && (
                              <span>尺码: {item.selectedSize}</span>
                            )}
                          </div>
                        )}
                        <div className="mt-2 text-sm font-light text-black">
                          {item.product.price
                            ? `¥${item.product.price.toLocaleString('zh-CN', {
                                minimumFractionDigits: 2,
                              })}`
                            : '价格待定'}
                        </div>
                      </div>

                      {/* 数量控制和删除 */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updating === item.id}
                            className="w-8 h-8 border border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="text-sm font-light text-black w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updating === item.id}
                            className="w-8 h-8 border border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          disabled={updating === item.id}
                          className="text-sm font-light text-gray-600 hover:text-red-600 disabled:opacity-50"
                        >
                          删除
                        </button>
                      </div>
                    </div>

                    {/* 小计 */}
                    <div className="text-right">
                      <div className="text-lg font-light text-black">
                        ¥
                        {(
                          (item.product.price || 0) * item.quantity
                        ).toLocaleString('zh-CN', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 订单摘要 */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6">
                <h2 className="text-xl font-light tracking-wider mb-6 text-black">
                  订单摘要
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm font-light text-gray-700">
                    <span>小计</span>
                    <span>
                      ¥{total.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-light text-black">
                      <span>总计</span>
                      <span>
                        ¥{total.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  disabled
                  className="w-full py-3 border border-black text-black font-light tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  结算
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

