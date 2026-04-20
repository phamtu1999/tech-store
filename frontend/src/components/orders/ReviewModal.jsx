import { Star } from 'lucide-react'

const ReviewModal = ({ isOpen, onClose, item, rating, setRating, comment, setComment, onSubmit }) => {
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-t-[2rem] sm:rounded-[2.5rem] w-full max-w-md shadow-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div className="text-center space-y-2">
             <h3 className="text-xl font-black text-gray-900 uppercase">Đánh giá sản phẩm</h3>
             <p className="text-xs text-gray-400 line-clamp-1 italic">{item.variantName}</p>
          </div>
          
          <div className="flex justify-center gap-2">
             {[1,2,3,4,5].map(star => (
                 <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-125">
                    <Star className={`h-8 w-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                 </button>
             ))}
          </div>

          <textarea 
              className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 transition-all text-sm min-h-[120px]"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={comment}
              onChange={e => setComment(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-3">
             <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 text-xs font-black uppercase">Hủy</button>
             <button onClick={onSubmit} className="flex-[2] py-4 rounded-2xl bg-primary-600 text-white text-xs font-black shadow-lg shadow-orange-100 uppercase">Gửi đánh giá</button>
          </div>
       </div>
    </div>
  )
}

export default ReviewModal
