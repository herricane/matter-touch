import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有产品或按分类筛选
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('获取产品失败：', error)
    return NextResponse.json(
      { error: '获取产品失败' },
      { status: 500 }
    )
  }
}

// POST - 创建新产品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, imageUrl, hoverImageUrl, category } = body

    // 基本验证
    if (!name || !category) {
      return NextResponse.json(
        { error: '名称和分类为必填项' },
        { status: 400 }
      )
    }

    // 验证分类
    if (!['clothings', 'accessories'].includes(category)) {
      return NextResponse.json(
        { error: '分类必须是 clothings 或 accessories' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
        hoverImageUrl: hoverImageUrl || null,
        category,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('创建产品失败：', error)
    return NextResponse.json(
      { error: '创建产品失败' },
      { status: 500 }
    )
  }
}

