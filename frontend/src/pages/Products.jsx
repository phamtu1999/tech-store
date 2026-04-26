import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react'
import { fetchProducts } from '../store/slices/productsSlice'
import { categoriesAPI } from '../api/categories'
import { brandsAPI } from '../api/brands'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'

const PRICE_OPTIONS = [
  { label: 'Dưới 5 triệu', min: '', max: '5000000' },
  { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
  { label: '10 - 20 triệu', min: '10000000', max: '20000000' },
  { label: 'Trên 20 triệu', min: '20000000', max: '' },
]

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'createdAt,desc' },
  { label: 'Giá tăng dần', value: 'price,asc' },
  { label: 'Giá giảm dần', value: 'price,desc' },
  { label: 'Đánh giá cao', value: 'rating,desc' },
]

const Products = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, isLoading, totalPages, currentPage } = useSelector((state) => state.products)
  
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Current active filters
  const currentCategory = searchParams.get('category') || ''
  const currentBrand = searchParams.get('brand') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentSort = searchParams.get('sort') || 'createdAt,desc'

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll()
        ])
        setCategories((catRes.data?.result || []).filter(c => c.active))
        setBrands(brandRes.data?.result || [])
      } catch (error) {
        console.error('Failed to fetch filters:', error)
      }
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    dispatch(
      fetchProducts({
        page: Number(searchParams.get('page') || 0),
        size: 16,
        q: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        sort: searchParams.get('sort') || 'createdAt,desc'
      })
    )
  }, [dispatch, searchParams])

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    nextParams.delete('page') // Reset page on filter change
    setSearchParams(nextParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateParams({ search: searchTerm.trim() })
  }

  const handlePriceChange = (min, max) => {
    updateParams({ minPrice: min, maxPrice: max })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSearchParams(new URLSearchParams())
  }

  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams)
    if (newPage > 0) {
      nextParams.set('page', String(newPage))
    } else {
      nextParams.delete('page')
    }
    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeFiltersCount = [currentCategory, currentBrand, currentMinPrice, currentMaxPrice].filter(Boolean).length

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white">Bộ lọc</h3>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest">
            Xóa lọc ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Danh mục</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${!currentCategory ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 dark:border-gray-700 text-transparent group-hover:border-primary-500'}`}>
              <Check className="w-3 h-3" />
            </div>
            <span className={`text-sm font-bold ${!currentCategory ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>Tất cả</span>
            <input type="radio" name="category" className="hidden" checked={!currentCategory} onChange={() => updateParams({ category: '' })} />
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${currentCategory === cat.slug ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 dark:border-gray-700 text-transparent group-hover:border-primary-500'}`}>
                <Check className="w-3 h-3" />
              </div>
              <span className={`text-sm font-bold ${currentCategory === cat.slug ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{cat.name}</span>
              <input type="radio" name="category" className="hidden" checked={currentCategory === cat.slug} onChange={() => updateParams({ category: cat.slug })} />
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Thương hiệu</h4>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${!currentBrand ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 dark:border-gray-700 text-transparent group-hover:border-primary-500'}`}>
              <Check className="w-3 h-3" />
            </div>
            <span className={`text-sm font-bold ${!currentBrand ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>Tất cả</span>
            <input type="radio" name="brand" className="hidden" checked={!currentBrand} onChange={() => updateParams({ brand: '' })} />
          </label>
          {brands.map(brand => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${currentBrand === brand.slug ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 dark:border-gray-700 text-transparent group-hover:border-primary-500'}`}>
                <Check className="w-3 h-3" />
              </div>
              <span className={`text-sm font-bold ${currentBrand === brand.slug ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{brand.name}</span>
              <input type="radio" name="brand" className="hidden" checked={currentBrand === brand.slug} onChange={() => updateParams({ brand: brand.slug })} />
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Mức giá</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border-[5px] transition-all ${!currentMinPrice && !currentMaxPrice ? 'border-primary-600 bg-white' : 'border-gray-300 dark:border-gray-700 bg-transparent group-hover:border-primary-400'}`}></div>
            <span className={`text-sm font-bold ${!currentMinPrice && !currentMaxPrice ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>Tất cả mức giá</span>
            <input type="radio" name="price" className="hidden" checked={!currentMinPrice && !currentMaxPrice} onChange={() => handlePriceChange('', '')} />
          </label>
          {PRICE_OPTIONS.map((opt, idx) => {
             const isActive = currentMinPrice === opt.min && currentMaxPrice === opt.max;
             return (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-[5px] transition-all ${isActive ? 'border-primary-600 bg-white' : 'border-gray-300 dark:border-gray-700 bg-transparent group-hover:border-primary-400'}`}></div>
                <span className={`text-sm font-bold ${isActive ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{opt.label}</span>
                <input type="radio" name="price" className="hidden" checked={isActive} onChange={() => handlePriceChange(opt.min, opt.max)} />
              </label>
             )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-[85%] max-w-sm bg-white dark:bg-dark-card h-full overflow-y-auto p-6 shadow-2xl animate-fade-in-right">
             <button onClick={() => setIsMobileFilterOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500">
               <X className="w-5 h-5" />
             </button>
             <FilterSidebar />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-5 sm:mb-8">
           <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-tight">
             Khám phá <span className="text-primary-600">Sản phẩm</span>
           </h1>
           <p className="mt-2 text-[11px] sm:text-sm font-bold text-gray-500 uppercase tracking-[0.2em] sm:tracking-widest">
             {products.length > 0 ? `Hiển thị ${products.length} sản phẩm` : 'Không có sản phẩm nào'}
           </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-24 bg-white dark:bg-dark-card rounded-[2rem] p-5 xl:p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-dark-border">
                <FilterSidebar />
             </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            
            {/* Top Bar (Search & Sort) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white dark:bg-dark-card p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 dark:border-dark-border items-stretch sm:items-center justify-between">
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 {/* Mobile Filter Button */}
                 <button 
                   onClick={() => setIsMobileFilterOpen(true)}
                   className="lg:hidden inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 shrink-0"
                 >
                   <SlidersHorizontal className="w-4 h-4" />
                   <span>Lọc</span>
                   {activeFiltersCount > 0 && (
                     <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{activeFiltersCount}</span>
                   )}
                 </button>

                 <form onSubmit={handleSearch} className="relative flex-1 sm:w-80 min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all dark:text-white"
                    />
                 </form>
               </div>

               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Sắp xếp:</span>
                 <div className="relative w-full sm:w-48">
                    <select
                      value={currentSort}
                      onChange={(e) => updateParams({ sort: e.target.value })}
                      className="w-full appearance-none bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary-500 rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
               </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i
                      } else if (currentPage < 3) {
                        pageNum = i
                      } else if (currentPage > totalPages - 3) {
                        pageNum = totalPages - 5 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl text-xs font-black transition-all ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none'
                              : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white dark:bg-dark-card rounded-[2rem] sm:rounded-[3rem] border border-gray-100 dark:border-dark-border shadow-sm text-center px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                   <Search className="w-9 h-9 sm:w-10 sm:h-10 text-gray-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-sm font-bold text-gray-400 max-w-sm">Thử thay đổi từ khóa hoặc điều kiện lọc của bạn.</p>
                <button onClick={clearFilters} className="mt-6 px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all w-full sm:w-auto">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
