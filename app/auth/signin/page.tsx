'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('注册成功，请登录')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        setError('邮箱或密码错误')
      } else if (result?.ok) {
        // 登录成功，跳转到首页
        router.push('/')
        router.refresh()
      } else {
        setError('登录失败，请稍后重试')
      }
    } catch (err) {
      console.error('登录错误:', err)
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />
      <div className="pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-extralight tracking-wider mb-8 text-center text-black">
            登录
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="text-sm text-green-600 text-center">{success}</div>
            )}
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-light tracking-widest uppercase text-black mb-2"
              >
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 text-black bg-white focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-light tracking-widest uppercase text-black mb-2"
              >
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 text-black bg-white focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-black text-black font-light tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600">
            还没有账号？{' '}
            <Link
              href="/auth/signup"
              className="text-black hover:opacity-60 transition-opacity underline"
            >
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <Navbar showHomeLink />
        <div className="pt-32 pb-16 px-6 sm:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="text-4xl font-extralight tracking-wider mb-8 text-black">
              登录
            </div>
            <div className="text-sm text-gray-600">加载中...</div>
          </div>
        </div>
      </main>
    }>
      <SignInForm />
    </Suspense>
  )
}

