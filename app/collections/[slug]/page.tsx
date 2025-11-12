import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/app/components/ProductCard'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!collection) {
    notFound()
  }

  const products = collection.products

  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />

      {/* 页面标题 */}
      <section className="pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extralight tracking-wider mb-4 text-black">
            {collection.name}
          </h1>
          <div className="w-24 h-px bg-black mx-auto mb-8"></div>
          <p className="text-sm tracking-widest uppercase text-gray-800">
            {collection.slug.toUpperCase()}
          </p>
        </div>
      </section>

      {/* 产品展示 */}
      <section className="py-12 px-6 sm:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 返回链接 */}
      <section className="py-12 px-6 sm:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/#collections"
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

