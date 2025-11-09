import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ProductInfoSection from '@/app/components/ProductInfoSection'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    notFound()
  }

  // 解析JSON字段
  const colors = product.colors ? JSON.parse(product.colors) : []
  const sizes = product.sizes ? JSON.parse(product.sizes) : []
  const galleryImages = product.galleryImages
    ? JSON.parse(product.galleryImages)
    : product.imageUrl
    ? [product.imageUrl, product.hoverImageUrl].filter(Boolean)
    : []
  const detailImages = product.detailImages ? JSON.parse(product.detailImages) : []
  const detailTexts = product.detailTexts ? JSON.parse(product.detailTexts) : []
  
  // 从数据库读取颜色图片映射
  const colorImagesMap = product.colorImages
    ? JSON.parse(product.colorImages)
    : {}

  // 格式化价格
  const formattedPrice = product.price
    ? `¥${product.price.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
    : null

  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />

      {/* 商品主信息区域 */}
      <section className="pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <ProductInfoSection
            name={product.name}
            price={formattedPrice}
            description={product.description || null}
            colors={colors}
            sizes={sizes}
            galleryImages={galleryImages}
            colorImagesMap={colorImagesMap}
          />
        </div>
      </section>

      {/* 商品参数信息 */}
      {(product.composition || product.care) && (
        <section className="py-12 px-6 sm:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 text-sm font-light text-gray-700">
              {product.composition && (
                <div>
                  <span className="font-normal tracking-widest uppercase text-black mr-4">
                    成分:
                  </span>
                  <span>{product.composition}</span>
                </div>
              )}
              {product.care && (
                <div>
                  <span className="font-normal tracking-widest uppercase text-black mr-4">
                    洗涤方式:
                  </span>
                  <span>{product.care}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 商品详细信息 - 图片和文字错落排布 */}
      {(detailImages.length > 0 || detailTexts.length > 0) && (
        <section className="py-16 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            {[0, 1, 2].map((index) => {
              const hasImage = index < detailImages.length && detailImages[index]
              const hasText = index < detailTexts.length && detailTexts[index]

              if (!hasImage && !hasText) return null

              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
                >
                  {/* 图片 */}
                  {hasImage && (
                    <div className={!isEven ? 'lg:order-2' : ''}>
                      <div className="relative w-full aspect-[4/3] bg-gray-50">
                        <Image
                          src={detailImages[index]}
                          alt={`${product.name} - 详情 ${index + 1}`}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                      </div>
                    </div>
                  )}

                  {/* 文字 */}
                  {hasText && (
                    <div className={`flex items-center ${!isEven ? 'lg:order-1' : ''}`}>
                      <p className="text-sm font-light leading-relaxed text-gray-700">
                        {detailTexts[index]}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Matter Touch Logo横条 */}
      <section className="py-16 px-6 sm:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-extralight tracking-widest text-black">
              MATTER TOUCH
            </div>
          </div>
        </div>
      </section>

      {/* 返回链接 */}
      <section className="py-12 px-6 sm:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href={`/collections/${product.category}`}
            className="text-sm font-light tracking-widest uppercase text-black hover:opacity-60 transition-opacity"
          >
            ← 返回系列
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

