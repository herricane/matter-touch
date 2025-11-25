'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import DeleteConfirmDialog from './DeleteConfirmDialog'

const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"

interface Collection {
  id: string
  name: string
  slug: string
  coverImageUrl?: string | null
  description?: string | null
}

interface CollectionManagementProps {
  onDataChange?: () => void
}

export default function CollectionManagement({ onDataChange }: CollectionManagementProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    coverImageUrl: '',
    description: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (editingCollectionId) {
      const collection = collections.find((c) => c.id === editingCollectionId)
      if (collection) {
        setFormData({
          name: collection.name,
          slug: collection.slug,
          coverImageUrl: collection.coverImageUrl || '',
          description: collection.description || '',
        })
      }
    }
  }, [editingCollectionId, collections])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/collections')
      if (res.ok) {
        const data = await res.json()
        setCollections(data)
      }
    } catch (error) {
      console.error('获取系列失败：', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCollectionId(null)
    setFormData({
      name: '',
      slug: '',
      coverImageUrl: '',
      description: '',
    })
    setShowCreateForm(true)
  }

  const handleEdit = (collection: Collection) => {
    setShowCreateForm(false)
    setEditingCollectionId(collection.id)
  }

  const handleCancelEdit = () => {
    setEditingCollectionId(null)
    setShowCreateForm(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
    setDeletePassword('')
    setDeleteError('')
  }

  const handleDeleteConfirm = async () => {
    if (!editingCollectionId) return

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

      const deleteRes = await fetch(`/api/collections/${editingCollectionId}`, {
        method: 'DELETE',
      })

      if (deleteRes.ok) {
        setCollections(collections.filter((c) => c.id !== editingCollectionId))
        setEditingCollectionId(null)
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
      const url = editingCollectionId
        ? `/api/collections/${editingCollectionId}`
        : '/api/collections'
      const method = editingCollectionId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          coverImageUrl: formData.coverImageUrl || null,
          description: formData.description || null,
        }),
      })

      if (res.ok) {
        setEditingCollectionId(null)
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

  const renderCollectionForm = (isEdit: boolean) => (
    <div className="bg-white shadow rounded-lg p-6 border-t border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {isEdit ? '编辑系列' : '添加系列'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              系列名称 *
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
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={inputClassName}
              placeholder="例如: clothings"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              封面图URL
            </label>
            <input
              type="text"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div className="sm:col-span-2">
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
        </div>
        <div className="flex justify-between items-center">
          {isEdit && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              删除系列
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
            添加系列
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          {renderCollectionForm(false)}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {collections.map((collection) => (
            <li key={collection.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {collection.coverImageUrl && (
                      <div className="flex-shrink-0 h-16 w-16 relative">
                        <Image
                          src={collection.coverImageUrl}
                          alt={collection.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {collection.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {collection.slug}
                      </p>
                      {collection.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingCollectionId !== collection.id && (
                      <button
                        onClick={() => handleEdit(collection)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        编辑
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {editingCollectionId === collection.id && (
                <div className="px-4 pb-4">
                  {renderCollectionForm(true)}
                </div>
              )}
            </li>
          ))}
        </ul>
        {collections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无系列，点击"添加系列"开始创建
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        title="删除系列"
        message="这是一个高危操作，删除系列将同时删除该系列下的所有产品，且无法恢复。请输入您的密码以确认删除。"
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

