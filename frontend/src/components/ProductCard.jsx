import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Eye, Store } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addToCart } from '../store/slices/cartSlice'
import Toast from './Toast'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [toast, setToast] = useState(null)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
    setToast({ message: 'Đã thêm vào giỏ hàng!', type: 'success' })
  }

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="product-card bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 border border-gray-100 h-full flex flex-col">
        {/* Image container - 1:1 ratio */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <Store className="h-10 w-10 opacity-20" />
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
             <button className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-MAIN hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 no-hover-scale">
               <Heart className="h-5 w-5" />
             </button>
             <button className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-MAIN hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 no-hover-scale">
               <Eye className="h-5 w-5" />
             </button>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.discountPercentage > 0 && (
              <div className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-red-500/30 uppercase tracking-tighter">
                GIẢM {product.discountPercentage}%
              </div>
            )}
            {product.isNew && (
              <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-emerald-500/30 uppercase tracking-tighter">
                MỚI
              </div>
            )}
            {product.soldCount > 100 && (
              <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-amber-500/30 uppercase tracking-tighter flex items-center gap-1">
                🔥 BÁN CHẠY
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Product name - 2 lines max */}
          <h3 className="mb-2 text-sm font-bold text-secondary-800 line-clamp-2 leading-tight group-hover:text-primary-MAIN transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating and sold count */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center px-1.5 py-0.5 bg-amber-50 rounded-md">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="ml-1 text-[11px] font-bold text-amber-700">{product.rating?.toFixed(1) || '5.0'}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">({product.reviewCount || 0})</span>
            </div>
            {product.soldCount > 0 && (
              <span className="text-[11px] font-semibold text-gray-500">
                Đã bán {product.soldCount > 1000 ? (product.soldCount/1000).toFixed(1) + 'k' : product.soldCount}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex flex-col mb-4">
              <span className="text-xl font-black text-[#ff4d00] tracking-tight">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-secondary-800 text-white py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary-MAIN hover:scale-105 transition-all duration-300 shadow-md hover:shadow-primary-500/20 text-xs no-hover-scale"
            >
              <ShoppingCart className="h-4 w-4" />
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Link>
  )
}

export default ProductCard
