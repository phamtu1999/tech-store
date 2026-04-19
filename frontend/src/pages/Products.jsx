import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { fetchProducts } from '../store/slices/productsSlice'
import { categoriesAPI } from '../api/categories'
import { brandsAPI } from '../api/brands'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'

const PRICE_OPTIONS = [
  { label: 'Tat ca muc gia', value: '' },
  { label: 'Duoi 5 trieu', value: '0-5000000' },
  { label: '5-10 trieu', value: '5000000-10000000' },
  { label: '10-20 trieu', value: '10000000-20000000' },
  { label: 'Tren 20 trieu', value: '20000000' },
]

const CATEGORY_FALLBACK = [
  { id: '1', name: 'Smartphone', slug: 'dien-thoai', active: true },
  { id: '2', name: 'Laptop', slug: 'laptop', active: true },
  { id: '3', name: 'Máy tính bảng', slug: 'tablet', active: true },
  { id: '4', name: 'Phụ kiện', slug: 'phu-kien', active: true },
  { id: '5', name: 'Đồng hồ', slug: 'dong-ho', active: true },
]

const Products = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, isLoading, totalPages, currentPage } = useSelector((state) => state.products)
  const [categories, setCategories] = useState(CATEGORY_FALLBACK)
  const [brands, setBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll()
        ])
        
        const fetchedCats = (catRes.data?.result || []).filter(c => c.active)
        if (fetchedCats.length > 0) {
          setCategories(fetchedCats)
        }
        
        setBrands(brandRes.data?.result || [])
      } catch (error) {
        console.error('Failed to fetch filters:', error)
        // Keep fallback if API fails
      }
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    dispatch(
      fetchProducts({
        page: Number(searchParams.get('page') || 0),
        size: 20,
        q: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
      })
    )
  }, [dispatch, searchParams])

  const updateParams = (updater) => {
    const nextParams = new URLSearchParams(searchParams)
    updater(nextParams)
    nextParams.delete('page')
    setSearchParams(nextParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateParams((params) => {
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      } else {
        params.delete('search')
      }
    })
  }

  const handleFilterChange = (key, value) => {
    updateParams((params) => {
      if (key === 'price') {
        params.delete('minPrice')
        params.delete('maxPrice')

        if (value) {
          const [minPrice, maxPrice] = value.split('-')
          if (minPrice) params.set('minPrice', minPrice)
          if (maxPrice) params.set('maxPrice', maxPrice)
        }
        return
      }

      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
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

  const clearFilters = () => {
    setSearchTerm('')
    setSearchParams(new URLSearchParams())
  }

  const selectedPriceRange = [searchParams.get('minPrice'), searchParams.get('maxPrice')]
    .filter(Boolean)
    .join('-')

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-secondary-800">
              TAT CA <span className="text-primary-MAIN">SAN PHAM</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">Tim kiem va loc san pham theo backend query hien tai</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tim theo ten san pham..."
                className="w-72 rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm outline-none transition-all focus:border-primary-MAIN focus:ring-2 focus:ring-primary-MAIN/20"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-primary-MAIN px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/20"
            >
              <Search className="h-4 w-4" />
              Tim kiem
            </button>
          </form>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
            <Filter className="h-4 w-4" />
            Bo loc
          </div>

          <select
            value={selectedPriceRange}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-primary-MAIN focus:outline-none focus:ring-2 focus:ring-primary-MAIN/20"
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={searchParams.get('category') || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-primary-MAIN focus:outline-none focus:ring-2 focus:ring-primary-MAIN/20"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={searchParams.get('brand') || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-primary-MAIN focus:outline-none focus:ring-2 focus:ring-primary-MAIN/20"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-100"
          >
            Xoa bo loc
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="rounded-xl border border-border bg-white px-4 py-2 text-text-primary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Truoc
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
                      className={`rounded-xl px-4 py-2 transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary-MAIN text-white'
                          : 'border border-border bg-white text-text-primary hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="rounded-xl border border-border bg-white px-4 py-2 text-text-primary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 text-6xl">?</div>
            <p className="text-lg font-medium text-text-primary">Khong tim thay san pham</p>
            <p className="text-text-secondary">Thu doi tu khoa hoac bo loc khac</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
