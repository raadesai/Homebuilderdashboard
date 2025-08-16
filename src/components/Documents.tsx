'use client'

import { useState, useEffect } from 'react'
import { useProject } from '../hooks/useProject'
import { getProjectDocuments, createDocument, deleteDocument, uploadFile, getFileUrl, deleteFile, getCurrentUser } from '../../lib/database'
import { Database } from '../../lib/database.types'

type Document = Database['public']['Tables']['documents']['Row'] & {
  uploaded_by?: Database['public']['Tables']['users']['Row'] | null
  milestone?: Database['public']['Tables']['project_milestones']['Row'] | null
}

export default function Documents() {
  const { currentProject } = useProject()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadDocuments()
    loadCurrentUser()
  }, [currentProject])

  const loadCurrentUser = async () => {
    const user = await getCurrentUser()
    setCurrentUser(user)
  }

  const loadDocuments = async () => {
    if (!currentProject) return
    
    try {
      setLoading(true)
      const data = await getProjectDocuments(currentProject.id)
      setDocuments(data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, category: string, description: string) => {
    if (!currentProject || !currentUser) return

    try {
      setUploading(true)
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${currentProject.id}/${category}/${fileName}`
      
      console.log('Starting upload process...')
      console.log('File path:', filePath)
      console.log('Current user:', currentUser.id)
      console.log('Current project:', currentProject.id)
      
      // Upload file to Supabase storage
      console.log('Step 1: Uploading file to storage...')
      const uploadResult = await uploadFile('project-documents', filePath, file)
      console.log('✅ File upload successful:', uploadResult)
      
      // Create document record in database
      console.log('Step 2: Creating document record...')
      const documentData = {
        project_id: currentProject.id,
        uploaded_by: currentUser.id,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category: category as any,
        description: description || null,
        is_client_visible: true
      }
      console.log('Document data:', documentData)
      
      const documentResult = await createDocument(documentData)
      console.log('✅ Document record created:', documentResult)
      
      // Reload documents
      console.log('Step 3: Reloading documents...')
      await loadDocuments()
      console.log('✅ Documents reloaded')
      
      setShowUploadModal(false)
      console.log('✅ Upload process completed successfully!')
    } catch (error: any) {
      console.error('❌ Error during upload process:', error)
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      })
      alert(`Error uploading file: ${error?.message || 'Unknown error'}. Please try again.`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      // Delete file from storage
      await deleteFile('project-documents', document.file_path)
      
      // Delete document record
      await deleteDocument(document.id)
      
      // Reload documents
      await loadDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error deleting document. Please try again.')
    }
  }

  const handleViewDocument = async (document: Document) => {
    try {
      const url = await getFileUrl('project-documents', document.file_path)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error viewing document:', error)
      alert('Error opening document. Please try again.')
    }
  }

  const handleDownloadDocument = async (document: Document) => {
    try {
      const url = await getFileUrl('project-documents', document.file_path)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.name
      link.click()
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Error downloading document. Please try again.')
    }
  }

  const getDocumentIcon = (category: string) => {
    switch (category) {
      case 'contract': return '📄'
      case 'permit': return '🏛️'
      case 'plan': return '📋'
      case 'photo': return '📸'
      case 'invoice': return '🧾'
      case 'video': return '🎥'
      default: return '📁'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const categories = [
    { key: 'all', label: 'All Documents', icon: '📁' },
    { key: 'contract', label: 'Contracts', icon: '📄' },
    { key: 'permit', label: 'Permits', icon: '🏛️' },
    { key: 'plan', label: 'Plans', icon: '📋' },
    { key: 'photo', label: 'Photos', icon: '📸' },
    { key: 'video', label: 'Videos', icon: '🎥' },
    { key: 'invoice', label: 'Invoices', icon: '🧾' },
    { key: 'other', label: 'Other', icon: '📄' }
  ]

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory)

  const getDocumentsByCategory = (category: string) => {
    return documents.filter(doc => doc.category === category)
  }

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a project to view documents.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Project Documents</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Document
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
            {category.key !== 'all' && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {getDocumentsByCategory(category.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.slice(1).map((category) => {
          const categoryDocs = getDocumentsByCategory(category.key)
          return (
            <div 
              key={category.key} 
              onClick={() => setSelectedCategory(category.key)}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">{category.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-500">
                    {categoryDocs.length} files
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.key === selectedCategory)?.label}
            <span className="ml-2 text-sm text-gray-500">({filteredDocuments.length})</span>
          </h3>
        </div>
        <div className="divide-y">
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No documents found in this category.</p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getDocumentIcon(doc.category)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(doc.created_at).toLocaleDateString()} • {formatFileSize(doc.file_size || 0)}
                        {doc.uploaded_by && (
                          <span> • by {doc.uploaded_by.first_name} {doc.uploaded_by.last_name}</span>
                        )}
                      </p>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View document"
                    >
                      <span>👁️</span>
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Download document"
                    >
                      <span>⬇️</span>
                    </button>
                    {(currentUser?.id === doc.uploaded_by || currentUser?.role === 'admin') && (
                      <button 
                        onClick={() => handleDeleteDocument(doc)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete document"
                      >
                        <span>🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
          uploading={uploading}
        />
      )}
    </div>
  )
}

// Upload Modal Component
function UploadModal({ onClose, onUpload, uploading }: {
  onClose: () => void
  onUpload: (file: File, category: string, description: string) => void
  uploading: boolean
}) {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState('other')
  const [description, setDescription] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      onUpload(file, category, description)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            {file ? (
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">Drop file here or click to browse</p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="contract">Contract</option>
              <option value="permit">Permit</option>
              <option value="plan">Plan</option>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
              <option value="invoice">Invoice</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this document..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}