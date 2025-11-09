'use client'

import { useState } from 'react'

interface Color {
  name: string
  hex?: string
}

interface ColorSelectorProps {
  colors: Color[]
  selectedColor?: string | null
  onColorSelect?: (colorName: string | null) => void
}

// 颜色名称到十六进制的映射
const colorMap: Record<string, string> = {
  黑色: '#000000',
  白色: '#FFFFFF',
  灰色: '#808080',
  深灰: '#404040',
  浅灰: '#C0C0C0',
  米色: '#F5F5DC',
  卡其色: '#C3B091',
  棕色: '#8B4513',
  驼色: '#D2B48C',
  红色: '#FF0000',
  蓝色: '#0000FF',
  绿色: '#008000',
  黄色: '#FFFF00',
  粉色: '#FFC0CB',
  紫色: '#800080',
  橙色: '#FFA500',
  海军蓝: '#000080',
  酒红色: '#800020',
  墨绿色: '#2F4F2F',
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
}: ColorSelectorProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)

  if (!colors || colors.length === 0) {
    return null
  }

  const handleColorClick = (colorName: string) => {
    if (onColorSelect) {
      // 如果点击的是已选中的颜色，则取消选择
      if (selectedColor === colorName) {
        onColorSelect(null)
      } else {
        onColorSelect(colorName)
      }
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-light tracking-widest uppercase text-black">
        颜色:
      </span>
      <div className="flex items-center gap-3">
        {colors.map((color, index) => {
          const hex = color.hex || colorMap[color.name] || '#CCCCCC'
          const isSelected = selectedColor === color.name
          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredColor(color.name)}
              onMouseLeave={() => setHoveredColor(null)}
            >
              <div
                onClick={() => handleColorClick(color.name)}
                className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-black scale-110 ring-2 ring-black ring-offset-2'
                    : 'border-gray-300 hover:scale-110'
                }`}
                style={{ backgroundColor: hex }}
                aria-label={color.name}
              />
              {/* 悬停提示 */}
              {hoveredColor === color.name && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs whitespace-nowrap z-20">
                  {color.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

