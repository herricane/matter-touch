'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

interface NavbarProps {
  showHomeLink?: boolean
}

export default function Navbar({ showHomeLink = false }: NavbarProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, userMenuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {showHomeLink ? (
            <Link href="/" className="text-xl font-light tracking-wider text-black hover:opacity-60 transition-opacity">
              MATTER TOUCH
            </Link>
          ) : (
            <div className="text-xl font-light tracking-wider text-black">
              MATTER TOUCH
            </div>
          )}

          {/* 桌面端导航 */}
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
            {session ? (
              <>
                <Link href="/cart" className="text-black hover:opacity-60 transition-opacity">
                  购物车
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="text-black hover:opacity-60 transition-opacity"
                  >
                    {session.user.name || session.user.email}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 shadow-lg">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' })
                          setUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-light tracking-widest uppercase text-black hover:bg-gray-50"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/auth/signin" className="text-black hover:opacity-60 transition-opacity">
                登录
              </Link>
            )}
          </div>

          {/* 移动端汉堡菜单按钮（仅图标） */}
          <button
            aria-label="打开菜单"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 hover:opacity-70"
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 点击遮罩，点击空白处可关闭 */}
      {open && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />}

      {/* 移动端菜单下拉（带淡入/向下进入、关闭向上淡出） */}
      <div
        ref={menuRef}
        className={`md:hidden absolute right-4 top-16 z-50 w-40 bg-white/95 border border-gray-200 shadow-lg transform transition-all duration-200 ease-out
        ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <nav className="flex flex-col py-2 text-sm font-light tracking-widest uppercase">
          <Link href="/#collections" onClick={() => setOpen(false)} className="px-4 py-2 text-black hover:bg-gray-50">
            系列
          </Link>
          <Link href="/#about" onClick={() => setOpen(false)} className="px-4 py-2 text-black hover:bg-gray-50">
            关于
          </Link>
          <Link href="/#contact" onClick={() => setOpen(false)} className="px-4 py-2 text-black hover:bg-gray-50">
            联系
          </Link>
          {session ? (
            <>
              <Link href="/cart" onClick={() => setOpen(false)} className="px-4 py-2 text-black hover:bg-gray-50">
                购物车
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                  setOpen(false)
                }}
                className="px-4 py-2 text-left text-black hover:bg-gray-50"
              >
                退出登录
              </button>
            </>
          ) : (
            <Link href="/auth/signin" onClick={() => setOpen(false)} className="px-4 py-2 text-black hover:bg-gray-50">
              登录
            </Link>
          )}
        </nav>
      </div>
    </nav>
  )
}

