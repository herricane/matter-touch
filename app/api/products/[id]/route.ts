import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - 获取单个产品
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { collection: true },
    })

    if (!product) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('获取产品失败：', error)
    return NextResponse.json({ error: '获取产品失败' }, { status: 500 })
  }
}

// PATCH - 更新产品
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      imageUrl,
      hoverImageUrl,
      colors,
      sizes,
      composition,
      care,
      galleryImages,
      detailTexts,
      detailImages,
      colorImages,
      collectionId,
      collectionSlug,
    } = body

    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    let resolvedCollectionId: string | null = null
    if (collectionId) {
      resolvedCollectionId = collectionId
    } else if (collectionSlug) {
      const collection = await prisma.collection.findUnique({
        where: { slug: collectionSlug },
      })
      resolvedCollectionId = collection?.id ?? null
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(price !== undefined && {
          price: price !== null && price !== '' ? parseFloat(price) : null,
        }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(hoverImageUrl !== undefined && { hoverImageUrl: hoverImageUrl || null }),
        ...(colors !== undefined && { colors: colors || null }),
        ...(sizes !== undefined && { sizes: sizes || null }),
        ...(composition !== undefined && { composition: composition || null }),
        ...(care !== undefined && { care: care || null }),
        ...(galleryImages !== undefined && { galleryImages: galleryImages || null }),
        ...(detailTexts !== undefined && { detailTexts: detailTexts || null }),
        ...(detailImages !== undefined && { detailImages: detailImages || null }),
        ...(colorImages !== undefined && { colorImages: colorImages || null }),
        ...(resolvedCollectionId && {
          collection: {
            connect: { id: resolvedCollectionId },
          },
        }),
      },
      include: { collection: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('更新产品失败：', error)
    return NextResponse.json({ error: '更新产品失败' }, { status: 500 })
  }
}

// DELETE - 删除产品
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: '产品已删除' })
  } catch (error) {
    console.error('删除产品失败：', error)
    return NextResponse.json({ error: '删除产品失败' }, { status: 500 })
  }
}

