'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Collection } from '../types'
import ImagePlaceholder from './ImagePlaceholder'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasImage = collection.coverImageUrl && !imageError

  return (
    <Link href={`/collections/${collection.slug}`} className="group cursor-pointer">
      <div className="relative w-full aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
        {hasImage ? (
          <Image
            src={collection.coverImageUrl!}
            alt={collection.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder titleSize="md" name={collection.name} />
        )}
      </div>
      <div className="text-center">
        <h3 className="text-base font-light tracking-widest uppercase text-black">
          {collection.name}
        </h3>
      </div>
    </Link>
  )
}

