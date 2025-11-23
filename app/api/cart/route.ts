import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取当前用户的购物车
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取或创建购物车
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  collection: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('获取购物车错误:', error)
    return NextResponse.json(
      { error: '获取购物车失败' },
      { status: 500 }
    )
  }
}

// 添加商品到购物车
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity = 1, selectedColor, selectedSize } = body

    if (!productId) {
      return NextResponse.json(
        { error: '商品ID为必填项' },
        { status: 400 }
      )
    }

    // 验证商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: '商品不存在' }, { status: 404 })
    }

    // 获取或创建购物车
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    // 检查是否已存在相同的商品（相同颜色和尺码）
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
      },
    })

    if (existingItem) {
      // 如果已存在，更新数量
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              collection: true,
            },
          },
        },
      })
      return NextResponse.json(updatedItem, { status: 200 })
    } else {
      // 如果不存在，创建新项
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
        },
        include: {
          product: {
            include: {
              collection: true,
            },
          },
        },
      })
      return NextResponse.json(newItem, { status: 201 })
    }
  } catch (error) {
    console.error('添加购物车错误:', error)
    return NextResponse.json(
      { error: '添加购物车失败' },
      { status: 500 }
    )
  }
}

