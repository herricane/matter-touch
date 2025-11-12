import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { seedData, formatForPrisma } from '@/prisma/data'

/**
 * 数据库初始化 API
 * 用于在 Vercel 部署后填充初始数据
 * 
 * 使用方法：
 * POST /api/init-db?secret=YOUR_SECRET  - 填充初始数据（仅在数据库为空时）
 * 
 * 注意：数据库表需要在构建时通过 prisma db push 创建
 * 安全：建议设置环境变量 DB_INIT_SECRET 并传递 secret 参数
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    // 可选：添加简单的密钥验证（建议设置环境变量 DB_INIT_SECRET）
    const expectedSecret = process.env.DB_INIT_SECRET
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized. Please provide correct secret parameter.' },
        { status: 401 }
      )
    }

    const results: string[] = []

    // 检查数据库状态
    results.push('正在检查数据库状态...')
    const existingProducts = await prisma.product.count()
    
    if (existingProducts > 0) {
      results.push(`数据库已有 ${existingProducts} 个产品，跳过数据初始化`)
      return NextResponse.json({
        success: true,
        message: '数据库已有数据，跳过初始化',
        details: results,
      })
    }

    // 填充初始数据
    results.push('数据库为空，开始填充初始数据...')
    const collections = formatForPrisma(seedData)

    for (const collection of collections) {
      await prisma.collection.create({
        data: {
          name: collection.name,
          slug: collection.slug,
          coverImageUrl: collection.coverImageUrl,
          products: {
            create: collection.products,
          },
        },
      })
    }

    const totalProducts = await prisma.product.count()
    results.push(`✓ 初始化完成！已创建 ${totalProducts} 个产品。`)

    return NextResponse.json({
      success: true,
      message: '数据库初始化完成',
      details: results,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: '初始化失败',
        message: error.message || String(error),
      },
      { status: 500 }
    )
  }
}
