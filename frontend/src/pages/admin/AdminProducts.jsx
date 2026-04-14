import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { fetchProducts, searchProducts } from '../../store/slices/productsSlice'
import { productsAPI } from '../../api/products'
import { filesAPI } from '../../api/files'
import AdminTable from '../../components/admin/AdminTable'
import { Plus, Search, Filter, FileUp, ImagePlus, X, Link, Upload } from 'lucide-react'
import Swal from 'sweetalert2'

const AdminProducts = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { products, totalPages, currentPage, isLoading } = useSelector((state) => state.products)
  const [page, setPage] = useState(0)
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [specs, setSpecs] = useState([{ key: '', value: '' }])
  const [slug, setSlug] = useState('')
  const [isManualSlug, setIsManualSlug] = useState(false)
  const [uploading, setUploading] = useState(false)

  const createSlug = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const CATEGORY_TEMPLATES = {
    '1': [ // Điện thoại
      { key: 'Màn hình', value: '' },
      { key: 'CPU', value: '' },
      { key: 'RAM', value: '' },
      { key: 'ROM', value: '' },
      { key: 'Pin', value: '' },
      { key: 'Camera', value: '' }
    ],
    '2': [ // Laptop
      { key: 'CPU', value: '' },
      { key: 'RAM', value: '' },
      { key: 'Ổ cứng', value: '' },
      { key: 'Màn hình', value: '' },
      { key: 'Card đồ họa', value: '' },
      { key: 'Trọng lượng', value: '' }
    ],
    'phukien': [
      { key: 'Kết nối', value: '' },
      { key: 'Tương thích', value: '' },
      { key: 'Màu sắc', value: '' }
    ]
  }

  useEffect(() => {
    dispatch(fetchProducts({ page, size: pageSize }))
  }, [dispatch, page, location.pathname])

  const productColumns = [
    { key: 'name', label: 'Tên sản phẩm' },
    { key: 'brand', label: 'Thương hiệu' },
    { key: 'price', label: 'Giá', render: (value) => 
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
    },
    { key: 'quantity', label: 'Tồn kho' },
    { key: 'sold', label: 'Đã bán' },
    { key: 'categoryName', label: 'Danh mục' },
    { key: 'active', label: 'Trạng thái', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value ? 'Hoạt động' : 'Ngừng'}
      </span>
    )},
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    if (searchTerm.trim()) {
      dispatch(searchProducts({ keyword: searchTerm, params: { page: 0, size: pageSize } }))
    } else {
      dispatch(fetchProducts({ page: 0, size: pageSize }))
    }
  }


  const handleDelete = async (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        await productsAPI.deleteProduct(product.id)
        dispatch(fetchProducts({ page, size: pageSize }))
      } catch (error) {
        alert('Xóa sản phẩm thất bại')
      }
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setPreviewImage(null)
    setSpecs([{ key: '', value: '' }])
    setSlug('')
    setIsManualSlug(false)
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setPreviewImage(product.imageUrl)
    setSlug(product.slug || '')
    setIsManualSlug(true)
    try {
      const parsedSpecs = product.specifications ? JSON.parse(product.specifications) : [{ key: '', value: '' }]
      setSpecs(Array.isArray(parsedSpecs) ? parsedSpecs : Object.entries(parsedSpecs).map(([key, value]) => ({ key, value })))
    } catch (e) {
      setSpecs([{ key: '', value: '' }])
    }
    setShowModal(true)
  }

  const handleNameChange = (name) => {
    if (!isManualSlug) {
      setSlug(createSlug(name))
    }
  }

  const handleCategoryChange = (categoryId) => {
    const template = CATEGORY_TEMPLATES[categoryId]
    if (template && specs.length <= 1 && !specs[0].key) {
      setSpecs(template)
    }
  }

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }])
  
  const removeSpec = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index)
    setSpecs(newSpecs.length ? newSpecs : [{ key: '', value: '' }])
  }

  const updateSpec = (index, field, value) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Lỗi', 'Dung lượng ảnh tối đa 5MB', 'error')
      return
    }

    setUploading(true)
    try {
      const response = await filesAPI.upload(file, 'products')
      setPreviewImage(response.data.data)
      Swal.fire({
        icon: 'success',
        title: 'Tải ảnh lên thành công',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      })
    } catch (error) {
      console.error('Upload failed:', error)
      Swal.fire('Lỗi', 'Không thể tải ảnh lên máy chủ', 'error')
    } finally {
      setUploading(false)
    }
  }

  const removePreviewImage = () => {
    setPreviewImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      model: formData.get('model'),
      categoryId: parseInt(formData.get('categoryId')),
      price: parseFloat(formData.get('price')),
      quantity: parseInt(formData.get('quantity')),
      description: formData.get('description'),
      imageUrl: previewImage,
      specifications: JSON.stringify(specs.filter(s => s.key && s.value)),
      slug: slug || createSlug(formData.get('name'))
    }

    try {
      Swal.fire({ title: 'Đang xử lý...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
      
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct.id, productData)
      } else {
        await productsAPI.createProduct(productData)
      }

      Swal.fire('Thành công!', `Sản phẩm đã được ${editingProduct ? 'cập nhật' : 'thêm'}`, 'success')
      setShowModal(false)
      dispatch(fetchProducts({ page, size: pageSize }))
    } catch (error) {
      Swal.fire('Lỗi!', error.response?.data?.message || 'Có lỗi xảy ra', 'error')
    }
  }
  const handleImportExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      Swal.fire({
        title: 'Đang xử lý...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      await productsAPI.importExcel(file)
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã nhập sản phẩm từ Excel thành công',
      })
      
      dispatch(fetchProducts({ page, size: pageSize }))
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.response?.data?.message || 'Lỗi khi nhập Excel',
      })
    }
    // Reset input
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-80"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Tìm kiếm
          </button>
        </form>
        <div className="flex gap-2">
          <label className="btn btn-secondary flex items-center cursor-pointer">
            <FileUp className="h-5 w-5 mr-2" />
            Nhập Excel
            <input
              type="file"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleImportExcel}
            />
          </label>
          <button onClick={handleAddNew} className="btn btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <AdminTable
            columns={productColumns}
            data={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm">
              <span className="text-sm text-text-tertiary">
                Trang {page + 1} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className={`btn btn-secondary px-4 py-2 ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === i 
                        ? 'bg-primary-MAIN text-white shadow-lg shadow-primary-500/20' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-bg dark:text-dark-text'
                    }`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))}
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className={`btn btn-secondary px-4 py-2 ${page === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-dark-bg/50">
              <h2 className="text-xl font-bold text-text-primary dark:text-dark-text">
                {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-dark-border rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>

            <form className="p-6 overflow-y-auto space-y-8" onSubmit={handleSubmit}>
              {/* General Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-primary-MAIN rounded-full"></div>
                  <h3 className="font-bold text-lg text-text-primary dark:text-dark-text">Thông tin cơ bản</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    className="input" 
                    placeholder="Ví dụ: iPhone 15 Pro Max" 
                    defaultValue={editingProduct?.name} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    required 
                  />
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/20">
                  <label className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                    <Link className="h-4 w-4" /> Đường dẫn (Slug)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="slug"
                      className="input h-9 bg-white dark:bg-dark-bg border-blue-200 dark:border-blue-800/40 text-sm" 
                      placeholder="iphone-15-pro-max" 
                      value={slug} 
                      onChange={(e) => {
                        setSlug(e.target.value)
                        setIsManualSlug(true)
                      }}
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const form = document.querySelector('form')
                        const name = form.querySelector('input[placeholder*="Ví dụ: iPhone"]').value
                        setSlug(createSlug(name))
                        setIsManualSlug(false)
                      }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-100 dark:bg-blue-900/30 px-3 rounded-lg"
                    >
                      Tự động
                    </button>
                  </div>
                  <p className="text-[10px] text-blue-500/70 mt-1">Đường dẫn này được dùng để tối ưu SEO cho sản phẩm.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Thương hiệu</label>
                    <input type="text" name="brand" className="input" placeholder="Ví dụ: Apple" defaultValue={editingProduct?.brand} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Model</label>
                    <input type="text" name="model" className="input" placeholder="Ví dụ: A3106" defaultValue={editingProduct?.model} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="input" 
                    name="categoryId"
                    required 
                    defaultValue={editingProduct?.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">Điện thoại</option>
                    <option value="2">Laptop</option>
                    <option value="3">Tablet</option>
                    <option value="4">Phụ kiện</option>
                  </select>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                    <h3 className="font-bold text-lg text-text-primary dark:text-dark-text">Thông số kỹ thuật</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={addSpec}
                    className="text-sm font-medium text-primary-MAIN hover:underline flex items-center gap-1"
                  >
                     <Plus className="h-4 w-4" /> Thêm thông số
                  </button>
                </div>
                
                <div className="space-y-3 bg-gray-50/50 dark:bg-dark-bg/50 p-4 rounded-2xl border border-gray-100 dark:border-dark-border">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-3 animate-slide-in">
                      <input 
                        type="text" 
                        placeholder="Tên (VD: RAM)" 
                        className="input h-10 py-1 text-sm w-1/3"
                        value={spec.key}
                        onChange={(e) => updateSpec(index, 'key', e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Giá trị (VD: 16GB)" 
                        className="input h-10 py-1 text-sm flex-1"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Stock Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  <h3 className="font-bold text-lg text-text-primary dark:text-dark-text">Giá & Kho hàng</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Giá bán <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input type="number" name="price" className="input pr-12" placeholder="0" defaultValue={editingProduct?.price} required />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-text-tertiary">₫</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Số lượng tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input type="number" name="quantity" className="input" placeholder="0" defaultValue={editingProduct?.quantity} required />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  <h3 className="font-bold text-lg text-text-primary dark:text-dark-text">Hình ảnh sản phẩm</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload box */}
                  <div 
                    className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-200 group relative
                      ${previewImage ? 'border-primary-MAIN bg-primary-50/10' : 'border-gray-200 dark:border-dark-border hover:border-primary-MAIN hover:bg-gray-50 dark:hover:bg-dark-bg'}`}
                  >
                    <div className="w-12 h-12 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {uploading ? (
                        <div className="h-6 w-6 border-2 border-primary-500 border-t-transparent animate-spin rounded-full"></div>
                      ) : (
                        <ImagePlus className="h-6 w-6 text-primary-MAIN" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-text-primary dark:text-dark-text">
                      {uploading ? 'Đang tải lên...' : 'Tải ảnh lên từ máy tính'}
                    </span>
                    <span className="text-xs text-text-tertiary mt-1">Hỗ trợ JPG, PNG (Tối đa 5MB)</span>
                    <input 
                      id="product-image" 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Preview box */}
                  <div className="space-y-3">
                    <div className="border border-gray-100 dark:border-dark-border rounded-2xl bg-gray-50/50 dark:bg-dark-bg/50 flex items-center justify-center relative overflow-hidden group min-h-[160px] h-[160px]">
                      {previewImage ? (
                        <>
                          <img src={previewImage} alt="Preview" className="w-full h-full object-contain p-2" />
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removePreviewImage(); }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-300" />
                          <span className="text-sm text-text-tertiary">Chưa có ảnh xem trước</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Hoặc dán URL ảnh tại đây..."
                        className="input h-10 text-sm pl-10"
                        value={previewImage || ''}
                        onChange={(e) => setPreviewImage(e.target.value)}
                      />
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                  <h3 className="font-bold text-lg text-text-primary dark:text-dark-text">Mô tả chi tiết</h3>
                </div>
                <textarea 
                  name="description"
                  className="input min-h-[120px] py-3 resize-none" 
                  placeholder="Nhập thông tin chi tiết về sản phẩm, thông số kỹ thuật..." 
                  defaultValue={editingProduct?.description} 
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary px-8"
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary px-10 flex items-center gap-2">
                  {editingProduct ? 'Cập nhật sản phẩm' : (
                    <>
                      <Plus className="h-5 w-5" />
                      Thêm sản phẩm
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
