'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Collection } from '../types'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/collections/${collection.slug}`} className="group cursor-pointer">
      <div className="relative w-full aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
        {!imageError ? (
          <Image
            src={collection.coverImageUrl}
            alt={collection.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-lg">{collection.name}系列</span>
          </div>
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

