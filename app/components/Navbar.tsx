import Link from 'next/link'

interface NavbarProps {
  showHomeLink?: boolean
}

export default function Navbar({ showHomeLink = false }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {showHomeLink ? (
            <Link href="/" className="text-2xl font-light tracking-wider text-black hover:opacity-60 transition-opacity">
              MATTER TOUCH
            </Link>
          ) : (
            <div className="text-2xl font-light tracking-wider text-black">
              MATTER TOUCH
            </div>
          )}
          <div className="hidden md:flex items-center space-x-8 text-sm font-light tracking-widest uppercase">
            <Link href="/#collections" className="text-black hover:opacity-60 transition-opacity">
              系列
            </Link>
            <Link href="/#about" className="text-black hover:opacity-60 transition-opacity">
              关于
            </Link>
            <Link href="/#contact" className="text-black hover:opacity-60 transition-opacity">
              联系
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

