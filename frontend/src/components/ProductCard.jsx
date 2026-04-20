import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Eye, Store, GitCompare } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToCompare, removeFromCompare } from '../store/slices/comparisonSlice'
import Toast from './Toast'
import LazyImage from './LazyImage'
import { getProductImageSources, handleProductImageError, DEFAULT_PRODUCT_PLACEHOLDER } from '../utils/productImageFallback'

const ProductCard = ({ product, showBadge }) => {
  const dispatch = useDispatch()
  const { items: compareItems } = useSelector((state) => state.comparison)
  const isComparing = compareItems.find(i => i.id === product.id)
  const [toast, setToast] = useState(null)

  const currentVariant = product.variants?.[0] || {}
  const price = product.price || currentVariant.price || 0

  const { primary: imageUrl, fallback: fallbackImageUrl } = getProductImageSources(product)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ 
      productId: product.id, 
      variantId: currentVariant.id,
      quantity: 1 
    }))
    setToast({ message: 'Đã thêm vào giỏ hàng!', type: 'success' })
  }

  const handleCompare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isComparing) {
      dispatch(removeFromCompare(product.id))
      setToast({ message: 'Đã xóa khỏi danh sách so sánh', type: 'info' })
    } else {
      if (compareItems.length >= 4) {
        setToast({ message: 'Chỉ có thể so sánh tối đa 4 sản phẩm', type: 'warning' })
        return
      }
      dispatch(addToCompare(product))
      setToast({ message: 'Đã thêm vào danh sách so sánh', type: 'success' })
    }
  }

  return (
    <Link to={`/${product.slug}`} className="block group h-full">
      <div className="bg-white dark:bg-dark-card rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-dark-border flex flex-col h-full relative">
        {/* Badges Overlay */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            {product.discountPercentage > 0 && (
              <div className="bg-rose-500/90 dark:bg-rose-600/20 dark:border dark:border-rose-500/30 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-lg shadow-rose-500/20 uppercase tracking-widest">
                -{product.discountPercentage}%
              </div>
            )}
            {showBadge === 'bestseller' && (
              <div className="bg-amber-500/90 dark:bg-amber-600/20 dark:border dark:border-amber-500/30 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-lg shadow-amber-500/20 uppercase tracking-widest flex items-center gap-1">
                🔥 Bestseller
              </div>
            )}
            {showBadge === 'new' && (
              <div className="bg-blue-600/90 dark:bg-blue-600/20 dark:border dark:border-blue-500/30 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-lg shadow-blue-600/20 uppercase tracking-widest flex items-center gap-1">
                ⭐ Mới
              </div>
            )}
            {product.isNew && !showBadge && (
              <div className="bg-emerald-600/90 dark:bg-emerald-600/20 dark:border dark:border-emerald-500/30 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-lg shadow-emerald-600/20 uppercase tracking-widest">
                New
              </div>
            )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-gray-50/50 dark:bg-black/20">
          <img 
            src={imageUrl || DEFAULT_PRODUCT_PLACEHOLDER} 
            alt={product.name}
            className="h-full w-full object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-105"
            onError={(e) => handleProductImageError(e, fallbackImageUrl)}
          />
          
          {/* Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/10 dark:bg-black/30 backdrop-blur-[1px] z-20">
             <button onClick={handleCompare} className={`p-3.5 rounded-full shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-[50ms] no-hover-scale ${isComparing ? 'bg-primary-MAIN text-white' : 'bg-white dark:bg-dark-secondary text-secondary-800 dark:text-white hover:bg-primary-600'}`}>
                <GitCompare className="h-5 w-5" />
             </button>
             <button onClick={handleAddToCart} className="p-3.5 bg-white dark:bg-dark-secondary text-secondary-800 dark:text-white rounded-full shadow-2xl hover:bg-primary-MAIN hover:text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-[150ms] no-hover-scale">
               <ShoppingCart className="h-5 w-5" />
             </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
             <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-200 dark:text-dark-border'}`} />
                ))}
             </div>
             <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{product.soldCount || 0} ĐÃ BÁN</span>
          </div>

          <h3 className="mb-3 text-xs sm:text-sm font-black text-secondary-800 dark:text-[#e8e8e8] line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-50 dark:border-dark-border pt-3 sm:pt-4">
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-black text-secondary-900 dark:text-white tracking-tight truncate">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
              </span>
              {product.originalPrice > price && (
                <span className="text-xs text-gray-400 line-through font-bold opacity-60 truncate">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 p-2.5 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm flex-shrink-0">
                <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Link>
  )
}

export default memo(ProductCard)
