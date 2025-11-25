import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST - 验证当前用户的密码
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权：请先登录' },
        { status: 401 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: '密码不能为空' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: '用户不存在或密码未设置' },
        { status: 404 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('验证密码失败：', error)
    return NextResponse.json(
      { error: '验证密码失败' },
      { status: 500 }
    )
  }
}

