import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />
      <div className="pt-32 pb-24 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-extralight tracking-wider mb-8 text-black">
            404
          </h1>
          <div className="w-24 h-px bg-black mx-auto mb-8"></div>
          <p className="text-lg font-light tracking-wide text-gray-900 mb-12">
            页面未找到
          </p>
          <Link
            href="/"
            className="text-sm font-light tracking-widest uppercase text-black hover:opacity-60 transition-opacity border-b border-black pb-2"
          >
            返回首页
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}

