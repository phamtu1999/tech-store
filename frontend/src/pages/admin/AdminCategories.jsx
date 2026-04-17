import { useEffect, useState } from 'react'
import { categoriesAPI } from '../../api/categories'
import { filesAPI } from '../../api/files'
import { Plus, Search, Upload, X, ImageIcon, Link, ImagePlus, Edit2, Trash2, ChevronRight, Filter } from 'lucide-react'
import Swal from 'sweetalert2'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all, active, inactive
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    slug: '',
    parentId: null,
    active: true,
    sortOrder: 0
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await categoriesAPI.getAll()
      setCategories(response.data.result || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
    setIsLoading(false)
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setFormData({ 
      name: '', 
      description: '', 
      imageUrl: '', 
      slug: '', 
      parentId: null,
      active: true,
      sortOrder: 0
    })
    setShowModal(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      slug: category.slug || '',
      parentId: category.parentId || null,
      active: category.active ?? true,
      sortOrder: category.sortOrder || 0
    })
    setShowModal(true)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await filesAPI.upload(file, 'categories')
      setFormData({ ...formData, imageUrl: response.data.result })
      Swal.fire({
        icon: 'success',
        title: 'Tải ảnh lên thành công',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      })
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể tải ảnh lên', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) return Swal.fire('Lỗi', 'Vui lòng nhập tên danh mục', 'error')
    if (!formData.slug) return Swal.fire('Lỗi', 'Vui lòng nhập slug', 'error')

    try {
      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory.id, formData)
        Swal.fire('Thành công', 'Đã cập nhật danh mục', 'success')
      } else {
        await categoriesAPI.createCategory(formData)
        Swal.fire('Thành công', 'Đã thêm danh mục mới', 'success')
      }
      setShowModal(false)
      fetchCategories()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Thao tác thất bại'
      Swal.fire('Lỗi', errorMsg, 'error')
    }
  }

  const handleDelete = async (category) => {
    // Show warning with product count
    const productWarning = category.productCount > 0 
      ? `<br><br><strong class="text-red-600">⚠️ Danh mục này có ${category.productCount} sản phẩm!</strong>`
      : ''
    
    const result = await Swal.fire({
      title: 'Xóa danh mục?',
      html: `Bạn có chắc muốn xóa "<strong>${category.name}</strong>"?${productWarning}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Hủy'
    })

    if (result.isConfirmed) {
      try {
        await categoriesAPI.deleteCategory(category.id)
        Swal.fire('Đã xóa', 'Danh mục đã được ẩn thành công', 'success')
        fetchCategories()
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Không thể xóa danh mục này'
        Swal.fire('Lỗi', errorMsg, 'error')
      }
    }
  }

  // Filter categories
  const filteredCategories = categories.filter(cat => {
    const matchSearch = cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || 
                       (statusFilter === 'active' && cat.active) ||
                       (statusFilter === 'inactive' && !cat.active)
    return matchSearch && matchStatus
  })

  // Get parent category name
  const getParentName = (parentId) => {
    if (!parentId) return null
    const parent = categories.find(c => c.id === parentId)
    return parent?.name || null
  }

  // Get root categories for parent selection
  const rootCategories = categories.filter(c => !c.parentId)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full h-11"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 pr-4 h-11 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="inactive">Đang ẩn</option>
            </select>
          </div>
        </div>

        <button onClick={handleAddNew} className="btn btn-primary flex items-center gap-2 h-11 px-6 w-full sm:w-auto">
          <Plus className="h-5 w-5" /> Thêm danh mục
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loading-spinner"></div></div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tên danh mục</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Danh mục cha</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy danh mục nào
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">#{category.id}</span>
                      </td>

                      {/* Image */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name} 
                            className="h-12 w-12 object-cover rounded-lg border border-gray-100 dark:border-dark-border"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23f3f4f6" width="48" height="48"/%3E%3C/svg%3E'
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-100 dark:bg-dark-bg flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded text-primary-600 dark:text-primary-400 font-mono">
                          /{category.slug}
                        </code>
                      </td>

                      {/* Parent Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.parentName ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <ChevronRight className="h-4 w-4" />
                            <span>{category.parentName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      {/* Product Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          {category.productCount || 0} SP
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          category.active 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {category.active ? '✓ Hiển thị' : '✕ Ẩn'}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                            title="Sửa"
                          >
                            <Edit2 className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-zoom-in border border-white/20 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-8 overflow-hidden sticky top-0 bg-white dark:bg-dark-card z-10">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
               <div className="flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {editingCategory ? 'Thay đổi thông tin danh mục của bạn' : 'Tạo mới một danh mục sản phẩm'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-all rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Basic Info */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="VD: Điện thoại, Laptop..."
                      className="input h-12 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border" 
                      required
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Slug (Đường dẫn) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="dien-thoai-thong-minh"
                      className="input h-12 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border"
                      required
                      value={formData.slug} 
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                    />
                    <p className="text-xs text-gray-500 ml-1">URL: /products/{formData.slug || 'slug'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Danh mục cha</label>
                    <select
                      className="input h-12 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border"
                      value={formData.parentId || ''}
                      onChange={(e) => setFormData({...formData, parentId: e.target.value ? Number(e.target.value) : null})}
                    >
                      <option value="">— Không có (Danh mục gốc) —</option>
                      {rootCategories
                        .filter(c => !editingCategory || c.id !== editingCategory.id)
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Thứ tự sắp xếp</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="input h-12 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border"
                      value={formData.sortOrder} 
                      onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mô tả</label>
                    <textarea 
                      placeholder="Mô tả ngắn gọn về danh mục này..."
                      className="input min-h-[100px] py-3 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border resize-none" 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Right Column: Image & Status */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Hình ảnh đại diện</label>
                    
                    <div className="relative group aspect-square rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-dark-bg border-2 border-dashed border-gray-200 dark:border-dark-border hover:border-primary-400 transition-all flex items-center justify-center">
                      {formData.imageUrl ? (
                        <>
                          <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                             <label className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 rounded-full cursor-pointer hover:bg-primary-50 transition-all shadow-xl font-bold text-sm">
                                <Upload className="h-4 w-4" />
                                Thay đổi ảnh
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                             </label>
                             <button 
                               type="button" 
                               onClick={() => setFormData({...formData, imageUrl: ''})}
                               className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl font-bold text-sm"
                             >
                               <X className="h-4 w-4" />
                               Gỡ bỏ
                             </button>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary-50/10 transition-all group/upload">
                          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/10 text-primary-500 rounded-3xl flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-all duration-300">
                            {uploading ? (
                              <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent animate-spin rounded-full"></div>
                            ) : (
                              <ImagePlus className="h-10 w-10" />
                            )}
                          </div>
                          <p className="text-sm font-black text-gray-700 dark:text-gray-200">Chọn ảnh từ máy</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 5MB</p>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                        </label>
                      )}
                    </div>

                    {/* URL Input */}
                    <div className="relative mt-3">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-100 dark:border-dark-border">
                        <Link className="h-4 w-4 text-primary-500" />
                      </div>
                      <input 
                        type="text" 
                        className="input pl-14 h-11 text-[13px] bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border font-medium" 
                        placeholder="Hoặc dán URL hình ảnh..."
                        value={formData.imageUrl} 
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-2xl border border-gray-100 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'} dark:bg-opacity-10 transition-colors`}>
                          <Plus className={`h-5 w-5 ${formData.active ? '' : 'rotate-45'} transition-transform`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Trạng thái hiển thị</p>
                          <p className="text-xs text-gray-500">{formData.active ? 'Đang hiển thị cho khách' : 'Đang ẩn khỏi khách'}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" className="sr-only peer"
                          checked={formData.active} 
                          onChange={(e) => setFormData({...formData, active: e.target.checked})} 
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-3 px-10 py-4 bg-primary-MAIN text-white font-black rounded-2xl hover:bg-primary-600 hover:shadow-2xl hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                  {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories
