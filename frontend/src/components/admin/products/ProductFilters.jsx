import { Search, FileUp, FileDown, Plus, Filter, X } from 'lucide-react'
import { useState } from 'react'

const ProductFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  handleImportExcel, 
  handleExportExcel, 
  handleAddNew,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(e)
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedStatus('')
    setSearchTerm('')
    handleSearch()
  }

  const hasActiveFilters = selectedCategory || selectedStatus || searchTerm

  return (
    <div className="space-y-4">
      {/* Main Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Search - Realtime with debounce */}
        <div className="relative flex-1 md:max-w-md w-full min-w-0">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm... (Enter để tìm)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); handleSearch() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-secondary flex items-center justify-center h-11 px-4 w-full sm:w-auto ${hasActiveFilters ? 'ring-2 ring-primary-500' : ''}`}
          >
            <Filter className="mr-2 h-4 w-4" />
            Lọc
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                {[selectedCategory, selectedStatus, searchTerm].filter(Boolean).length}
              </span>
            )}
          </button>
          
          <label className="btn btn-secondary flex cursor-pointer items-center justify-center h-11 px-4 border border-gray-300 hover:bg-gray-50 w-full sm:w-auto">
            <FileUp className="mr-2 h-4 w-4" />
            Nhập Excel
            <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleImportExcel} />
          </label>
          
          <button 
            onClick={handleExportExcel} 
            className="btn btn-secondary flex items-center justify-center h-11 px-4 border border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
          </button>
          
          <button 
            onClick={handleAddNew} 
            className="btn btn-primary flex items-center justify-center h-11 px-6 bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold shadow-lg shadow-primary-200 hover:opacity-90 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Bộ lọc nâng cao</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Xóa tất cả
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã ẩn</option>
                <option value="outofstock">Hết hàng</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full h-10 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Áp dụng lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductFilters
