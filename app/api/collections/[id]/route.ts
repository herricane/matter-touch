import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminApi } from '@/lib/api-admin-auth'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - 获取单个系列（公开）
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!collection) {
      return NextResponse.json({ error: '系列不存在' }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('获取系列失败：', error)
    return NextResponse.json({ error: '获取系列失败' }, { status: 500 })
  }
}

// PATCH - 更新系列（仅管理员）
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const authError = await requireAdminApi()
  if (authError) return authError

  const { id } = await params
  try {
    const body = await request.json()
    const { name, slug, coverImageUrl, description } = body

    // 检查系列是否存在
    const existing = await prisma.collection.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: '系列不存在' }, { status: 404 })
    }

    // 如果更新slug，检查是否与其他系列冲突
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.collection.findUnique({
        where: { slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: '该slug已存在' },
          { status: 400 }
        )
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(coverImageUrl !== undefined && { coverImageUrl: coverImageUrl || null }),
        ...(description !== undefined && { description: description || null }),
      },
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error('更新系列失败：', error)
    return NextResponse.json({ error: '更新系列失败' }, { status: 500 })
  }
}

// DELETE - 删除系列（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const authError = await requireAdminApi()
  if (authError) return authError

  const { id } = await params
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
    })

    if (!collection) {
      return NextResponse.json({ error: '系列不存在' }, { status: 404 })
    }

    await prisma.collection.delete({
      where: { id },
    })

    return NextResponse.json({ message: '系列已删除' })
  } catch (error) {
    console.error('删除系列失败：', error)
    return NextResponse.json({ error: '删除系列失败' }, { status: 500 })
  }
}

