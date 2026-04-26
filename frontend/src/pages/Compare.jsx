import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trash2, ArrowLeft, GitCompare, Star, Check, X } from 'lucide-react'
import { removeFromCompare, clearCompare } from '../store/slices/comparisonSlice'
import { getProductImageSources, handleProductImageError } from '../utils/productImageFallback'

const Compare = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.comparison)

  if (items.length === 0) {
    return (
      <div className="py-20 sm:py-24 text-center animate-fade-in px-4">
        <div className="bg-gray-50 dark:bg-white/5 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
           <GitCompare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white mb-4">DANH SÁCH TRỐNG</h1>
        <p className="text-gray-500 font-bold mb-6 sm:mb-8 uppercase tracking-widest text-[10px] sm:text-xs leading-relaxed">Vui lòng chọn ít nhất 2 sản phẩm để so sánh</p>
        <Link to="/products" className="bg-primary-600 text-white px-8 sm:px-10 py-4 rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-primary-600/20 hover:scale-105 transition-all inline-flex items-center gap-2">
           <ArrowLeft className="w-4 h-4" /> QUAY LẠI MUA SẮM
        </Link>
      </div>
    )
  }

  // extract all unique attributes keys
  const allAttributes = Array.from(new Set(items.flatMap(p => p.attributes?.map(a => a.name) || [])))

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 md:px-0">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <GitCompare className="h-6 w-6 text-primary-600" />
              <span className="text-primary-600 font-black text-xs uppercase tracking-widest">Premium Tool</span>
           </div>
           <h1 className="text-2xl sm:text-4xl font-black text-secondary-900 dark:text-white tracking-tight leading-tight">SO SÁNH <span className="text-primary-600">SẢN PHẨM</span></h1>
           <p className="text-gray-500 font-bold mt-2 uppercase tracking-tighter text-[10px] sm:text-sm leading-relaxed">Đối chiếu thông số chi tiết giữa các siêu phẩm</p>
        </div>
        <button 
          onClick={() => dispatch(clearCompare())}
          className="flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-all p-2 self-start md:self-auto"
        >
           <Trash2 className="w-4 h-4" /> Xóa toàn bộ danh sách
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4 pb-2">
        <div className="min-w-[700px] sm:min-w-[800px]">
           {/* Header Row - Images and Basics */}
           <div className="grid grid-cols-5 gap-6 mb-12">
              <div className="col-span-1"></div>
              {items.map(product => {
                const { primary: imageUrl, fallback: fallbackImageUrl } = getProductImageSources(product)
                return (
                  <div key={product.id} className="col-span-1 flex flex-col items-center relative group">
                     <button 
                        onClick={() => dispatch(removeFromCompare(product.id))}
                        className="absolute top-0 right-0 bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all z-10 opacity-100 sm:opacity-0 group-hover:opacity-100"
                     >
                        <X className="w-4 h-4" />
                     </button>
                     <div className="w-full aspect-square bg-white rounded-3xl sm:rounded-[2.5rem] border border-gray-100 shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => handleProductImageError(e, fallbackImageUrl)}
                        />
                     </div>
                     <div className="text-center px-2">
                        <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
                           <Star className="w-3 h-3 fill-current" />
                           <span className="text-[10px] font-black text-gray-400">{product.rating || '5.0'}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-secondary-900 dark:text-white line-clamp-2 min-h-[2.5rem] mb-3 leading-tight uppercase tracking-tight">{product.name}</h3>
                        <p className="text-base sm:text-lg font-black text-primary-600 tracking-tighter">
                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || product.variants?.[0]?.price || 0)}
                        </p>
                        <Link to={`/${product.slug}`} className="mt-4 block w-full py-2.5 bg-secondary-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-900 transition-all">
                           Xem chi tiết
                        </Link>
                     </div>
                  </div>
                )
              })}
              {[...Array(4 - items.length)].map((_, i) => (
                <Link key={i} to="/products" className="col-span-1 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-primary-200 hover:bg-primary-50/20 transition-all group">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-gray-50 group-hover:scale-110 transition-transform">
                      <GitCompare className="w-6 h-6 text-gray-300" />
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thêm sản phẩm</span>
                </Link>
              ))}
           </div>

           {/* Features Section */}
           <div className="space-y-6 px-4 md:px-0">
              <div className="bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6">
                 <h2 className="text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary-500" /> THÔNG SỐ KỸ THUẬT
                 </h2>
              </div>

              <div className="divide-y divide-gray-100">
                 {allAttributes.map(attrName => (
                   <div key={attrName} className="grid grid-cols-5 gap-3 sm:gap-6 py-5 sm:py-6 items-center hover:bg-gray-50/50 transition-all rounded-2xl px-3 sm:px-4">
                      <div className="col-span-1 min-w-0">
                         <span className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest break-words">{attrName}</span>
                      </div>
                      {items.map(product => {
                         const attr = product.attributes?.find(a => a.name === attrName)
                         return (
                           <div key={product.id} className="col-span-1 px-2 min-w-0">
                              <span className="text-xs sm:text-sm font-black text-secondary-800 dark:text-gray-100 tracking-tight break-words">{attr?.value || '—'}</span>
                           </div>
                         )
                      })}
                      {[...Array(4 - items.length)].map((_, i) => <div key={i} className="col-span-1"></div>)}
                   </div>
                 ))}
                 
                 {/* Empty state for attributes if none exist */}
                 {allAttributes.length === 0 && (
                    <div className="py-12 text-center text-gray-400 uppercase text-[10px] font-black tracking-widest">
                       Chưa có thông số chi tiết để so sánh
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default Compare
