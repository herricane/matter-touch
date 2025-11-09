import type { Collection } from '../types'

export const collections: Collection[] = [
  {
    name: '成衣',
    slug: 'clothings',
    coverImageUrl: '/images/collections/clothings/cover.webp',
  },
  {
    name: '配饰',
    slug: 'accessories',
    coverImageUrl: '/images/collections/accessories/cover.webp',
  },
]

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}

