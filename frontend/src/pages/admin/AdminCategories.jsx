import { useEffect, useState } from 'react'
import { categoriesAPI } from '../../api/categories'
import { filesAPI } from '../../api/files'
import AdminTable from '../../components/admin/AdminTable'
import { Plus, Search, Upload, X, ImageIcon, Link, ImagePlus } from 'lucide-react'
import Swal from 'sweetalert2'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    slug: '',
    active: true
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await categoriesAPI.getAll()
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
    setIsLoading(false)
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '', image: '', slug: '', active: true })
    setShowModal(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      slug: category.slug || '',
      active: category.active ?? true
    })
    setShowModal(true)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await filesAPI.upload(file, 'categories')
      setFormData({ ...formData, image: response.data.data })
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
      Swal.fire('Lỗi', 'Thao tác thất bại', 'error')
    }
  }

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: 'Xóa danh mục?',
      text: `Bạn có chắc muốn xóa "${category.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy'
    })

    if (result.isConfirmed) {
      try {
        await categoriesAPI.deleteCategory(category.id)
        Swal.fire('Đã xóa', 'Danh mục đã được xóa thành công', 'success')
        fetchCategories()
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa danh mục này', 'error')
      }
    }
  }

  const categoryColumns = [
    { key: 'image', label: 'Hình ảnh', render: (val) => (
      <img src={val || 'https://via.placeholder.com/50'} alt="cat" className="h-10 w-10 object-cover rounded-lg border border-gray-100" />
    )},
    { key: 'name', label: 'Tên danh mục' },
    { key: 'active', label: 'Trạng thái', render: (value) => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {value ? 'Hoạt động' : 'Ngừng'}
      </span>
    )},
    { key: 'createdAt', label: 'Ngày tạo', render: (value) => new Date(value).toLocaleDateString('vi-VN') },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-80 h-11"
          />
        </div>
        <button onClick={handleAddNew} className="btn btn-primary flex items-center gap-2 h-11 px-6">
          <Plus className="h-5 w-5" /> Thêm danh mục
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loading-spinner"></div></div>
      ) : (
        <AdminTable columns={categoryColumns} data={categories} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-zoom-in border border-white/20">
            {/* Header */}
            <div className="relative p-8 overflow-hidden">
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
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tên danh mục</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="VD: Điện thoại, Laptop..."
                        className="input h-12 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border" 
                        required
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Slug (Đường dẫn)</label>
                    <input 
                      type="text" 
                      placeholder="dien-thoai-thong-minh"
                      className="input h-12 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border"
                      value={formData.slug} 
                      onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mô tả</label>
                    <textarea 
                      placeholder="Mô tả ngắn gọn về danh mục này..."
                      className="input min-h-[120px] py-3 bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-dark-border resize-none" 
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
                      {formData.image ? (
                        <>
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                             <label className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 rounded-full cursor-pointer hover:bg-primary-50 transition-all shadow-xl font-bold text-sm">
                                <Upload className="h-4 w-4" />
                                Thay đổi ảnh
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                             </label>
                             <button 
                               type="button" 
                               onClick={() => setFormData({...formData, image: ''})}
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
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
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
                        value={formData.image} 
                        onChange={(e) => setFormData({...formData, image: e.target.value})} 
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
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Trạng thái</p>
                          <p className="text-xs text-gray-500">{formData.active ? 'Đang hiển thị' : 'Đang ẩn'}</p>
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
                  className="flex-3 px-10 py-4 bg-primary-MAIN text-white font-black rounded-2xl hover:bg-primary-600 hover:shadow-2xl hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group"
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
