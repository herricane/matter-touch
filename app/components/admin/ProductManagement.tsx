'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description?: string | null
  price?: number | null
  imageUrl?: string | null
  hoverImageUrl?: string | null
  colors?: string | null
  sizes?: string | null
  composition?: string | null
  care?: string | null
  galleryImages?: string | null
  detailTexts?: string | null
  detailImages?: string | null
  colorImages?: string | null
  collectionId: string
  collection: {
    id: string
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

interface Collection {
  id: string
  name: string
  slug: string
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    hoverImageUrl: '',
    colors: '',
    sizes: '',
    composition: '',
    care: '',
    galleryImages: '',
    detailTexts: '',
    detailImages: '',
    colorImages: '',
    collectionId: '',
  })

  // 获取产品和系列数据
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, collectionsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/collections'),
      ])
      
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
      
      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json()
        setCollections(collectionsData)
      }
    } catch (error) {
      console.error('获取数据失败：', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      hoverImageUrl: '',
      colors: '',
      sizes: '',
      composition: '',
      care: '',
      galleryImages: '',
      detailTexts: '',
      detailImages: '',
      colorImages: '',
      collectionId: collections[0]?.id || '',
    })
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      imageUrl: product.imageUrl || '',
      hoverImageUrl: product.hoverImageUrl || '',
      colors: product.colors || '',
      sizes: product.sizes || '',
      composition: product.composition || '',
      care: product.care || '',
      galleryImages: product.galleryImages || '',
      detailTexts: product.detailTexts || '',
      detailImages: product.detailImages || '',
      colorImages: product.colorImages || '',
      collectionId: product.collectionId,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？')) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        const error = await res.json()
        alert(error.error || '删除失败')
      }
    } catch (error) {
      console.error('删除失败：', error)
      alert('删除失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      const method = editingProduct ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      if (res.ok) {
        setShowForm(false)
        fetchData()
      } else {
        const error = await res.json()
        alert(error.error || '操作失败')
      }
    } catch (error) {
      console.error('操作失败：', error)
      alert('操作失败')
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理店铺中的所有产品，包括添加、编辑和删除操作
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleCreate}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            添加产品
          </button>
        </div>
      </div>

      {/* 产品表单 */}
      {showForm && (
        <div className="mb-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingProduct ? '编辑产品' : '添加产品'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  产品名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  所属系列 *
                </label>
                <select
                  required
                  value={formData.collectionId}
                  onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">请选择系列</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  价格
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  主图URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  悬停图URL
                </label>
                <input
                  type="text"
                  value={formData.hoverImageUrl}
                  onChange={(e) => setFormData({ ...formData, hoverImageUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                描述
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  颜色 (JSON数组)
                </label>
                <input
                  type="text"
                  placeholder='["黑色", "白色"]'
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  尺码 (JSON数组)
                </label>
                <input
                  type="text"
                  placeholder='["S", "M", "L"]'
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  成分
                </label>
                <input
                  type="text"
                  value={formData.composition}
                  onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  护理说明
                </label>
                <input
                  type="text"
                  value={formData.care}
                  onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                {editingProduct ? '更新' : '创建'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 产品列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {product.imageUrl && (
                      <div className="flex-shrink-0 h-16 w-16 relative">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.collection.name}
                      </p>
                      {product.price && (
                        <p className="text-sm text-gray-900">¥{product.price}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无产品，点击"添加产品"开始创建
          </div>
        )}
      </div>
    </div>
  )
}

