'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为6位')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '注册失败，请稍后重试')
      } else {
        // 注册成功后跳转到登录页
        router.push('/auth/signin?registered=true')
      }
    } catch (err) {
      setError('注册失败，请稍后重试')
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
            注册
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-light tracking-widest uppercase text-black mb-2"
              >
                用户名（可选）
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black bg-white focus:outline-none focus:border-black"
              />
            </div>
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
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 text-black bg-white focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-light tracking-widest uppercase text-black mb-2"
              >
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 text-black bg-white focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-black text-black font-light tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600">
            已有账号？{' '}
            <Link
              href="/auth/signin"
              className="text-black hover:opacity-60 transition-opacity underline"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

