import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'

// NextAuth v4 使用 getServerSession
export async function getSession() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

