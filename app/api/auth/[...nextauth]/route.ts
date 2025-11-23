import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-config'

const handler = NextAuth(authOptions)

// NextAuth v4 在 App Router 中的导出方式
export { handler as GET, handler as POST }

