import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase text-gray-700">
          <div className="mb-4 md:mb-0">
            © 2024 MATTER TOUCH. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-700 hover:text-black transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-700 hover:text-black transition-colors">
              使用条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

