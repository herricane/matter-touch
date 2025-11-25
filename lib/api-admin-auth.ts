import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * API路由中检查管理员权限
 * 如果不是管理员，返回401错误
 */
export async function requireAdminApi() {
  const session = await getSession()
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: '未授权：请先登录' },
      { status: 401 }
    )
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: '未授权：需要管理员权限' },
      { status: 403 }
    )
  }
  
  return null // 返回null表示通过验证
}

