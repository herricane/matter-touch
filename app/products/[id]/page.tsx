import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ProductInfoSection from '@/app/components/ProductInfoSection'
import DetailImage from '@/app/components/DetailImage'

interface PageProps {
  params: {
    id: string
  }
}

// 强制动态渲染，避免构建时的数据库连接问题
export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { collection: true },
  })

  if (!product || !product.collection) {
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

  // colorImages 现在是 { [color: string]: string } 格式，每个颜色对应单个图片
  const colorImagesMap: Record<string, string> = product.colorImages
    ? JSON.parse(product.colorImages)
    : {}

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
              const imageSrc = index < detailImages.length ? detailImages[index] : null
              const text = index < detailTexts.length ? detailTexts[index] : null

              if (!imageSrc && !text) return null

              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
                >
                  {imageSrc && (
                    <div className={!isEven ? 'lg:order-2' : ''}>
                      <DetailImage
                        src={imageSrc}
                        alt={`${product.name} - 详情 ${index + 1}`}
                      />
                    </div>
                  )}

                  {text && (
                    <div className={`flex items-center ${!isEven ? 'lg:order-1' : ''}`}>
                      <p className="text-sm font-light leading-relaxed text-gray-700">
                        {text}
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
            href={`/collections/${product.collection.slug}`}
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

