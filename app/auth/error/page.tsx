'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: '服务器配置错误，请稍后重试',
    AccessDenied: '访问被拒绝',
    Verification: '验证失败，请检查您的邮箱或密码',
    Default: '登录时发生错误，请稍后重试',
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />
      <div className="pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-extralight tracking-wider mb-8 text-black">
            登录错误
          </h1>
          <p className="text-sm font-light text-gray-700 mb-8">
            {errorMessage}
          </p>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="inline-block w-full py-3 border border-black text-black font-light tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
            >
              返回登录
            </Link>
            <Link
              href="/"
              className="inline-block w-full py-3 border border-gray-300 text-gray-700 font-light tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <Navbar showHomeLink />
        <div className="pt-32 pb-16 px-6 sm:px-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-extralight tracking-wider mb-8 text-black">
              登录错误
            </h1>
            <div className="text-sm text-gray-600">加载中...</div>
          </div>
        </div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}

