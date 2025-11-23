'use client'

type TitleSize = 'sm' | 'md' | 'lg'

const titleSizeClassMap: Record<TitleSize, string> = {
  sm: 'text-sm font-light',
  md: 'text-base font-light',
  lg: 'text-lg font-light',
}

interface ImagePlaceholderProps {
  className?: string
  titleSize?: TitleSize
  name: string
}

export default function ImagePlaceholder({
  className = '',
  titleSize = 'md',
  name,
}: ImagePlaceholderProps) {
  const containerClass = `absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`

  return (
    <div className={containerClass}>
      <div className="text-center text-gray-400">
        <div className={titleSizeClassMap[titleSize]}>
          {name}
          </div>
      </div>
    </div>
  )
}
