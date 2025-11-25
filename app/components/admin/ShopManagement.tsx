'use client'

import { useState } from 'react'
import ProductManagement from './ProductManagement'
import CollectionManagement from './CollectionManagement'

export default function ShopManagement() {
  const [activeTab, setActiveTab] = useState<'products' | 'collections'>('products')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDataChange = () => {
    // 触发子组件刷新
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="px-4 py-6">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">店铺管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理店铺中的所有产品和系列
          </p>
        </div>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'products'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            产品
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'collections'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            系列
          </button>
        </nav>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'products' && (
        <ProductManagement key={refreshKey} onDataChange={handleDataChange} />
      )}
      {activeTab === 'collections' && (
        <CollectionManagement key={refreshKey} onDataChange={handleDataChange} />
      )}
    </div>
  )
}

