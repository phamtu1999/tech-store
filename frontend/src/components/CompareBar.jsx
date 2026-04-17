import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { X, GitCompare, Trash2 } from 'lucide-react'
import { removeFromCompare, clearCompare } from '../store/slices/comparisonSlice'
import { getProductImageSources, handleProductImageError } from '../utils/productImageFallback'

const CompareBar = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.comparison)

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4 animate-slide-in-up">
      <div className="glass border border-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 overflow-x-auto scrollbar-hide py-2 px-4">
           {items.map((product) => {
             const { primary: imageUrl, fallback: fallbackImageUrl } = getProductImageSources(product)
             return (
               <div key={product.id} className="relative group flex-shrink-0 animate-scale-up">
                 <div className="w-16 h-16 bg-white rounded-2xl p-2 border border-white/60 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                   <img 
                     src={imageUrl} 
                     alt={product.name} 
                     className="w-full h-full object-contain"
                     onError={(e) => handleProductImageError(e, fallbackImageUrl)}
                   />
                 </div>
                 <button 
                   onClick={() => dispatch(removeFromCompare(product.id))}
                   className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                 >
                   <X className="w-3 h-3" />
                 </button>
               </div>
             )
           })}
           
           {/* Empty Slots */}
           {[...Array(Math.max(0, 4 - items.length))].map((_, i) => (
             <div key={i} className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center text-white/40">
                <GitCompare className="w-6 h-6 opacity-20" />
             </div>
           ))}
        </div>

        <div className="flex items-center gap-3 pr-4">
           <button 
             onClick={() => dispatch(clearCompare())}
             className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
             title="Xóa tất cả"
           >
             <Trash2 className="w-5 h-5" />
           </button>
           
           <Link 
             to="/compare" 
             className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-600/20 transition-all hover:-translate-y-1 block whitespace-nowrap"
           >
             So sánh ({items.length}/4)
           </Link>
        </div>
      </div>
    </div>
  )
}

export default CompareBar
