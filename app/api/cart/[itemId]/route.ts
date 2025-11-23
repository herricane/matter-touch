import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 更新购物车商品数量
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()
    const { quantity } = body

    if (quantity === undefined || quantity < 1) {
      return NextResponse.json(
        { error: '数量必须大于0' },
        { status: 400 }
      )
    }

    // 验证购物车项是否属于当前用户
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: '购物车项不存在' }, { status: 404 })
    }

    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    // 更新数量
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            collection: true,
          },
        },
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('更新购物车错误:', error)
    return NextResponse.json(
      { error: '更新购物车失败' },
      { status: 500 }
    )
  }
}

// 删除购物车商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 验证购物车项是否属于当前用户
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: '购物车项不存在' }, { status: 404 })
    }

    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    // 删除项
    await prisma.cartItem.delete({
      where: { id: params.itemId },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除购物车错误:', error)
    return NextResponse.json(
      { error: '删除购物车失败' },
      { status: 500 }
    )
  }
}

