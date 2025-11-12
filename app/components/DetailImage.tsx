'use client'

import Image from 'next/image'
import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'

interface DetailImageProps {
  src: string
  alt: string
}

export default function DetailImage({ src, alt }: DetailImageProps) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          quality={90}
          onError={() => setHasError(true)}
        />
      ) : (
        <ImagePlaceholder titleSize="md" name={alt} />
      )}
    </div>
  )
}
