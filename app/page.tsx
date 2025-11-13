import HeroCarousel from './components/HeroCarousel'
import CollectionCard from './components/CollectionCard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { prisma } from '@/lib/prisma'

// 强制动态渲染，避免构建时的数据库连接问题
export const dynamic = 'force-dynamic'

export default async function Home() {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: 'asc' },
  })

  // 从数据库获取主视觉图片
  const heroImages = await prisma.heroImage.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink={true} />

      {/* 主视觉区域 - 背景图片自动滚动 */}
      <section className="pt-20">
        <HeroCarousel
          images={heroImages.map((img) => ({
            name: img.name,
            imageUrl: img.imageUrl,
          }))}
        />
      </section>

      {/* 产品系列展示 */}
      <section id="collections" className="py-24 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight tracking-wider mb-12 text-black">
              系列
            </h2>
            <div className="w-24 h-px bg-black mx-auto mb-12"></div>
          </div>

          {/* 系列网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* 关于部分 */}
      <section id="about" className="py-24 px-6 sm:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-wider mb-12 text-black">
            关于
          </h2>
          <div className="w-24 h-px bg-black mx-auto mb-12"></div>
          <p className="text-base md:text-lg font-light leading-relaxed tracking-wide text-gray-900 max-w-2xl mx-auto">
            Matter Touch 致力于打造简洁、时尚、高品质的个人品牌服饰。
            我们相信，真正的时尚在于细节，在于质感，在于那些看似简单却充满力量的设计。
          </p>
        </div>
      </section>

      {/* 联系部分 */}
      <section id="contact" className="py-24 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-wider mb-12 text-black">
            联系
          </h2>
          <div className="w-24 h-px bg-black mx-auto mb-12"></div>
          <div className="space-y-4 text-sm tracking-wider">
            <p className="font-light text-gray-900">
              <span className="uppercase">Email:</span> contact@mattertouch.com
            </p>
            <p className="font-light text-gray-900">
              <span className="uppercase">WeChat:</span> mattertouch
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

