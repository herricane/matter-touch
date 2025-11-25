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

// 表单数据类型
type FormData = {
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

// 将产品转换为表单数据
const productToFormData = (product: Product): FormData => ({
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

// 创建空表单数据
const createEmptyFormData = (defaultCollectionId: string = ''): FormData => ({
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

// 输入框通用样式
const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<FormData>(createEmptyFormData())

  // 获取产品和系列数据
  useEffect(() => {
    fetchData()
  }, [])

  // 当编辑产品ID改变时，自动预填表单数据
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
    // formData 会由 useEffect 自动设置，这里不需要重复设置
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
      // 先验证密码
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

      // 密码验证通过，执行删除
      const deleteRes = await fetch(`/api/products/${editingProductId}`, {
        method: 'DELETE',
      })

      if (deleteRes.ok) {
        setProducts(products.filter((p) => p.id !== editingProductId))
        setEditingProductId(null)
        setShowDeleteDialog(false)
        setDeletePassword('')
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
          {/* 左下角：删除按钮（仅编辑模式） */}
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
          
          {/* 右下角：取消和更新/创建按钮 */}
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

      {/* 创建产品表单 */}
      {showCreateForm && (
        <div className="mb-6">
          {renderProductForm(false)}
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
              {/* 编辑表单显示在产品下方 */}
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
            暂无产品，点击"添加产品"开始创建
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleDeleteCancel}
            ></div>

            {/* 对话框 */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      删除产品
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        这是一个高危操作，删除后无法恢复。请输入您的密码以确认删除。
                      </p>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        密码
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => {
                          setDeletePassword(e.target.value)
                          setDeleteError('')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isDeleting) {
                            handleDeleteConfirm()
                          }
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm text-gray-900 bg-white"
                        placeholder="请输入您的密码"
                        autoFocus
                      />
                      {deleteError && (
                        <p className="mt-2 text-sm text-red-600">{deleteError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting || !deletePassword}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isDeleting ? '删除中...' : '确认删除'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

