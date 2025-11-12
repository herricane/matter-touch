import { PrismaClient } from '@prisma/client'

function createClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
  // 动态启用 Prisma Accelerate（如设置了 PRISMA_ACCELERATE_URL）
  // 以便在 Vercel Serverless 环境下获得更稳的连接表现
  try {
    const { withAccelerate } = require('@prisma/extension-accelerate')
    if (process.env.PRISMA_ACCELERATE_URL) {
      return client.$extends(withAccelerate())
    }
  } catch (e) {
    // ignore when accelerate is not installed
  }
  return client
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

