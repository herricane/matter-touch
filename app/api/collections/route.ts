import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminApi } from '@/lib/api-admin-auth'

// GET - 获取所有系列（公开）
export async function GET(request: NextRequest) {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('获取系列失败：', error)
    return NextResponse.json({ error: '获取系列失败' }, { status: 500 })
  }
}

// POST - 创建新系列（仅管理员）
export async function POST(request: NextRequest) {
  const authError = await requireAdminApi()
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, slug, coverImageUrl, description } = body

    // 基本验证
    if (!name || !slug) {
      return NextResponse.json(
        { error: '名称和slug为必填项' },
        { status: 400 }
      )
    }

    // 检查slug是否已存在
    const existing = await prisma.collection.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: '该slug已存在' },
        { status: 400 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        coverImageUrl: coverImageUrl || null,
        description: description || null,
      },
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('创建系列失败：', error)
    return NextResponse.json({ error: '创建系列失败' }, { status: 500 })
  }
}

