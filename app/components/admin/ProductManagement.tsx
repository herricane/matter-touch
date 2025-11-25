'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import DeleteConfirmDialog from './DeleteConfirmDialog'

const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"

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

type ProductFormData = {
  name: string
  description: string
  price: string
  imageUrl: string
  hoverImageUrl: string
  colors: string
  sizes: string
  composition: string
  care: string
  galleryImages: string
  detailTexts: string
  detailImages: string
  colorImages: string
  collectionId: string
}

const productToFormData = (product: Product): ProductFormData => ({
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

const createEmptyFormData = (defaultCollectionId: string = ''): ProductFormData => ({
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
  collectionId: defaultCollectionId,
})

interface ProductManagementProps {
  onDataChange?: () => void
}

export default function ProductManagement({ onDataChange }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>(createEmptyFormData())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (editingProductId) {
      const product = products.find((p) => p.id === editingProductId)
      if (product) {
        setFormData(productToFormData(product))
      }
    }
  }, [editingProductId, products])

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
    setEditingProductId(null)
    setFormData(createEmptyFormData(collections[0]?.id || ''))
    setShowCreateForm(true)
  }

  const handleEdit = (product: Product) => {
    setShowCreateForm(false)
    setEditingProductId(product.id)
  }

  const handleCancelEdit = () => {
    setEditingProductId(null)
    setShowCreateForm(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
    setDeletePassword('')
    setDeleteError('')
  }

  const handleDeleteConfirm = async () => {
    if (!editingProductId) return

    if (!deletePassword) {
      setDeleteError('请输入密码')
      return
    }

    setIsDeleting(true)
    setDeleteError('')

    try {
      const verifyRes = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      })

      if (!verifyRes.ok) {
        const error = await verifyRes.json()
        setDeleteError(error.error || '密码验证失败')
        setIsDeleting(false)
        return
      }

      const deleteRes = await fetch(`/api/products/${editingProductId}`, {
        method: 'DELETE',
      })

      if (deleteRes.ok) {
        setProducts(products.filter((p) => p.id !== editingProductId))
        setEditingProductId(null)
        setShowDeleteDialog(false)
        setDeletePassword('')
        onDataChange?.()
      } else {
        const error = await deleteRes.json()
        setDeleteError(error.error || '删除失败')
      }
    } catch (error) {
      console.error('删除失败：', error)
      setDeleteError('删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setDeletePassword('')
    setDeleteError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProductId
        ? `/api/products/${editingProductId}`
        : '/api/products'
      const method = editingProductId ? 'PATCH' : 'POST'

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
        setEditingProductId(null)
        setShowCreateForm(false)
        fetchData()
        onDataChange?.()
      } else {
        const error = await res.json()
        alert(error.error || '操作失败')
      }
    } catch (error) {
      console.error('操作失败：', error)
      alert('操作失败')
    }
  }

  const renderProductForm = (isEdit: boolean) => (
    <div className="bg-white shadow rounded-lg p-6 border-t border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {isEdit ? '编辑产品' : '添加产品'}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
            className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          {isEdit && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              删除产品
            </button>
          )}
          {!isEdit && <div></div>}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              {isEdit ? '更新' : '创建'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto"></div>
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

      {showCreateForm && (
        <div className="mb-6">
          {renderProductForm(false)}
        </div>
      )}

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
                    {editingProductId !== product.id && (
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        编辑
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {editingProductId === product.id && (
                <div className="px-4 pb-4">
                  {renderProductForm(true)}
                </div>
              )}
            </li>
          ))}
        </ul>
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无产品，点击&ldquo;添加产品&rdquo;开始创建
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        title="删除产品"
        message="这是一个高危操作，删除后无法恢复。请输入您的密码以确认删除。"
        password={deletePassword}
        error={deleteError}
        isDeleting={isDeleting}
        onPasswordChange={(pwd) => {
          setDeletePassword(pwd)
          setDeleteError('')
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}
