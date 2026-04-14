import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, searchProducts } from '../store/slices/productsSlice'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import { Search, Filter } from 'lucide-react'

const Products = () => {
  const dispatch = useDispatch()
  const { products, isLoading, totalPages, currentPage } = useSelector(
    (state) => state.products
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(fetchProducts({ page, size: 20 }))
  }, [dispatch, page])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      dispatch(searchProducts({ keyword: searchTerm, params: { page: 0, size: 20 } }))
    } else {
      dispatch(fetchProducts({ page: 0, size: 20 }))
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary-800 tracking-tight">
              TẤT CẢ <span className="text-primary-MAIN">SẢN PHẨM</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Khám phá những công nghệ mới nhất</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-full p-1 border border-gray-100 shadow-sm">
              <button className="px-6 py-2 bg-primary-MAIN text-white text-sm font-bold rounded-full shadow-lg shadow-primary-500/20 no-hover-scale">
                Mới nhất
              </button>
              <button className="px-6 py-2 text-gray-500 text-sm font-bold rounded-full hover:bg-gray-50 no-hover-scale">
                Phổ biến
              </button>
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:border-primary-MAIN hover:text-primary-MAIN transition-all">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Product grid - Responsive: mobile 1, tablet 2, desktop 4 */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="rounded-xl border border-border bg-white px-4 py-2 text-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
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
                  className="rounded-xl border border-border bg-white px-4 py-2 text-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium text-text-primary">Không tìm thấy sản phẩm</p>
            <p className="text-text-secondary">Thử từ khóa tìm kiếm khác</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
