import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有产品或按系列筛选
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collectionSlug = searchParams.get('collection')

    const products = await prisma.product.findMany({
      where: collectionSlug
        ? {
            collection: {
              slug: collectionSlug,
            },
          }
        : undefined,
      include: {
        collection: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('获取产品失败：', error)
    return NextResponse.json({ error: '获取产品失败' }, { status: 500 })
  }
}

// POST - 创建新产品
export async function POST(request: NextRequest) {
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

    // 基本验证：必须有名称与归属系列
    if (!name) {
      return NextResponse.json({ error: '名称为必填项' }, { status: 400 })
    }

    let resolvedCollectionId: string | null = collectionId || null
    if (!resolvedCollectionId && collectionSlug) {
      const collection = await prisma.collection.findUnique({
        where: { slug: collectionSlug },
      })
      resolvedCollectionId = collection?.id ?? null
    }

    if (!resolvedCollectionId) {
      return NextResponse.json({ error: '必须指定所属系列' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        price: price !== undefined && price !== null ? parseFloat(price) : null,
        imageUrl: imageUrl ?? null,
        hoverImageUrl: hoverImageUrl ?? null,
        colors: colors ?? null,
        sizes: sizes ?? null,
        composition: composition ?? null,
        care: care ?? null,
        galleryImages: galleryImages ?? null,
        detailTexts: detailTexts ?? null,
        detailImages: detailImages ?? null,
        colorImages: colorImages ?? null,
        collection: {
          connect: { id: resolvedCollectionId },
        },
      },
      include: {
        collection: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('创建产品失败：', error)
    return NextResponse.json({ error: '创建产品失败' }, { status: 500 })
  }
}

