import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * 检查当前用户是否为管理员
 * 如果不是管理员，重定向到登录页
 */
export async function requireAdmin() {
  const session = await getSession()
  
  if (!session || !session.user) {
    redirect('/auth/signin')
  }
  
  if (session.user.role !== 'admin') {
    redirect('/auth/signin?error=Unauthorized')
  }
  
  return session
}

/**
 * 检查当前用户是否为管理员（不重定向，返回布尔值）
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

