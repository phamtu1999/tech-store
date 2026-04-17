import { X, Upload, ImagePlus, Link as LinkIcon, Plus, RefreshCw, Star, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

const ProductFormModal = ({
  isOpen,
  onClose,
  editingProduct,
  formState,
  handleFieldChange,
  imageUrls,
  setImageUrls,
  specs,
  setSpecs,
  categoryOptions,
  uploading,
  handleImageChange,
  handleSubmit,
  sanitizeImageUrls,
  EMPTY_SPEC
}) => {
  const [categorySearch, setCategorySearch] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  // Auto-generate slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Auto-generate SKU
  const generateSKU = () => {
    const prefix = formState.brandName ? formState.brandName.substring(0, 3).toUpperCase() : 'PRD'
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}-${random}`
  }

  // Handle name change and auto-generate slug
  const handleNameChange = (value) => {
    handleFieldChange('name', value)
    if (!editingProduct || !formState.slug) {
      handleFieldChange('slug', generateSlug(value))
    }
  }

  // Format price to VND
  const formatPrice = (value) => {
    if (!value) return ''
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  // Validate form
  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 3) {
          newErrors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự'
        } else {
          delete newErrors.name
        }
        break
      case 'price':
        if (!value || value <= 0) {
          newErrors.price = 'Giá phải lớn hơn 0'
        } else {
          delete newErrors.price
        }
        break
      case 'stockQuantity':
        if (value < 0) {
          newErrors.stockQuantity = 'Số lượng không được âm'
        } else {
          delete newErrors.stockQuantity
        }
        break
    }
    
    setErrors(newErrors)
  }

  // Filter categories
  const filteredCategories = categoryOptions.filter(cat =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const selectedCategory = categoryOptions.find(cat => cat.value === formState.categoryId)

  const addSpec = () => setSpecs((prev) => [...prev, { ...EMPTY_SPEC }])
  const removeSpec = (index) => setSpecs((prev) => {
    const next = prev.filter((_, i) => i !== index)
    return next.length > 0 ? next : [{ ...EMPTY_SPEC }]
  })
  const updateSpec = (index, field, value) => {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const addImageField = () => setImageUrls((prev) => [...prev, ''])
  const updateImageUrl = (index, value) => setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)))
  const removeImage = (index) => setImageUrls((prev) => prev.filter((_, i) => i !== index))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <p className="mt-0.5 text-xs text-text-tertiary">
              {editingProduct ? 'Chỉnh sửa thông tin sản phẩm' : 'Điền đầy đủ thông tin bên dưới'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-gray-200">
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        <form className="flex flex-1 overflow-hidden" onSubmit={handleSubmit}>
          {/* Main Form Content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-text-primary border-l-4 border-primary-600 pl-3">
                Thông tin cơ bản
              </h3>
              
              {/* Product Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={(e) => validateField('name', e.target.value)}
                  className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="VD: iPhone 15 Pro Max 256GB"
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {/* Slug with regenerate */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Slug (URL) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formState.slug}
                      onChange={(e) => handleFieldChange('slug', e.target.value)}
                      className="input flex-1"
                      placeholder="iphone-15-pro-max-256gb"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleFieldChange('slug', generateSlug(formState.name))}
                      className="rounded-lg border border-gray-300 px-3 hover:bg-gray-50 transition-colors"
                      title="Tạo lại slug"
                    >
                      <RefreshCw className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-text-tertiary">Tự động tạo từ tên sản phẩm</p>
                </div>

                {/* Brand */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.brandName}
                    onChange={(e) => handleFieldChange('brandName', e.target.value)}
                    className="input"
                    placeholder="VD: Apple, Samsung, Xiaomi"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {/* Category - Searchable Select */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedCategory?.label || categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value)
                        setShowCategoryDropdown(true)
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      className="input"
                      placeholder="Tìm kiếm danh mục..."
                      required
                    />
                    {showCategoryDropdown && (
                      <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                handleFieldChange('categoryId', opt.value)
                                setCategorySearch('')
                                setShowCategoryDropdown(false)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-primary-50 transition-colors"
                            >
                              {opt.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">Không tìm thấy danh mục</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Model/Variant */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Phiên bản
                  </label>
                  <input
                    type="text"
                    value={formState.modelName}
                    onChange={(e) => handleFieldChange('modelName', e.target.value)}
                    className="input"
                    placeholder="VD: 256GB Titan Tự Nhiên"
                  />
                  <p className="mt-1 text-xs text-text-tertiary">Dung lượng, màu sắc, v.v.</p>
                </div>
              </div>

              {/* Description - Smaller */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                  Mô tả ngắn gọn
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="input min-h-[80px] resize-none py-2.5"
                  placeholder="Nhập mô tả ngắn gọn về sản phẩm (2-3 câu)..."
                />
                <p className="mt-1 text-xs text-text-tertiary">Tối đa 200 ký tự</p>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-text-primary border-l-4 border-green-600 pl-3">
                Giá & Kho hàng
              </h3>
              
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {/* Price */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Giá bán <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formState.price}
                      onChange={(e) => {
                        handleFieldChange('price', e.target.value)
                        validateField('price', e.target.value)
                      }}
                      className={`input pr-12 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="0"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                      VNĐ
                    </span>
                  </div>
                  {formState.price > 0 && (
                    <p className="mt-1 text-xs text-green-600 font-medium">
                      {formatPrice(formState.price)} đ
                    </p>
                  )}
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formState.stockQuantity}
                    onChange={(e) => {
                      handleFieldChange('stockQuantity', e.target.value)
                      validateField('stockQuantity', e.target.value)
                    }}
                    className={`input ${errors.stockQuantity ? 'border-red-500' : ''}`}
                    placeholder="0"
                    required
                  />
                  {errors.stockQuantity && <p className="mt-1 text-xs text-red-500">{errors.stockQuantity}</p>}
                </div>

                {/* SKU */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                    Mã SKU
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formState.sku || ''}
                      onChange={(e) => handleFieldChange('sku', e.target.value)}
                      className="input flex-1"
                      placeholder="Tự động tạo"
                    />
                    <button
                      type="button"
                      onClick={() => handleFieldChange('sku', generateSKU())}
                      className="rounded-lg border border-gray-300 px-3 hover:bg-gray-50 transition-colors"
                      title="Tạo SKU"
                    >
                      <RefreshCw className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.active}
                    onChange={(e) => handleFieldChange('active', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  Hiển thị sản phẩm
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.featured || false}
                    onChange={(e) => handleFieldChange('featured', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <Star className="h-4 w-4 text-yellow-500" />
                  Sản phẩm nổi bật
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.flashSale || false}
                    onChange={(e) => handleFieldChange('flashSale', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Zap className="h-4 w-4 text-orange-500" />
                  Flash Sale
                </label>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary border-l-4 border-blue-600 pl-3">
                  Thông số kỹ thuật
                </h3>
                <button
                  type="button"
                  onClick={addSpec}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Thêm thông số
                </button>
              </div>
              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/30 p-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => updateSpec(index, 'key', e.target.value)}
                      placeholder="Tên (VD: Màn hình)"
                      className="input h-9 w-1/3 text-sm"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                      placeholder="Giá trị (VD: 6.7 inch)"
                      className="input h-9 flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-primary border-l-4 border-purple-600 pl-3">
                    Hình ảnh sản phẩm
                  </h3>
                  <p className="mt-1 text-xs text-text-tertiary pl-3">
                    Ảnh đầu tiên sẽ được dùng làm ảnh chính
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Thêm URL
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                {/* Upload Area */}
                <div className="relative flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-primary-400 hover:bg-primary-50/30 transition-all p-4 text-center">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600" />
                      <span className="text-xs text-gray-600">Đang tải...</span>
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="mb-2 h-10 w-10 text-primary-500" />
                      <span className="text-sm font-bold text-text-primary">Tải ảnh lên</span>
                      <span className="mt-1 text-xs text-text-tertiary">hoặc kéo thả vào đây</span>
                      <span className="mt-2 text-xs text-gray-500">PNG, JPG (max 5MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </div>

                {/* Image Preview & URL Inputs */}
                <div className="space-y-3">
                  {/* Preview Grid */}
                  {imageUrls.length > 0 && (
                    <div className="grid max-h-[240px] grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2">
                      {imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-contain p-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              Chính
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL Inputs */}
                  <div className="space-y-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => updateImageUrl(index, e.target.value)}
                            className="input h-9 pl-9 text-xs"
                            placeholder={`URL ảnh ${index + 1}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="hidden w-80 border-l border-gray-200 bg-gray-50/50 p-5 lg:block">
            <h3 className="mb-4 text-sm font-bold text-text-primary">Xem trước</h3>
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                {imageUrls[0] ? (
                  <img
                    src={imageUrls[0]}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImagePlus className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  {formState.featured && (
                    <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">
                      NỔI BẬT
                    </span>
                  )}
                  {formState.flashSale && (
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                      FLASH SALE
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-text-primary line-clamp-2">
                  {formState.name || 'Tên sản phẩm'}
                </h4>
                <p className="text-xs text-text-tertiary line-clamp-2">
                  {formState.description || 'Mô tả sản phẩm...'}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary-600">
                    {formState.price ? formatPrice(formState.price) : '0'} đ
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <span>Kho: {formState.stockQuantity || 0}</span>
                  {formState.brandName && (
                    <>
                      <span>•</span>
                      <span>{formState.brandName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="text-sm text-text-tertiary">
              <span className="text-red-500">*</span> Trường bắt buộc
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
              >
                {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
