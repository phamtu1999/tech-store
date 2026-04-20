import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviewsByProduct } from '../store/slices/reviewsSlice'
import { Star, CheckCircle, Award } from 'lucide-react'

const ReviewList = ({ productId }) => {
  const dispatch = useDispatch()
  const { reviews, isLoading } = useSelector((state) => state.reviews)

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviewsByProduct(productId))
    }
  }, [dispatch, productId])

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="card p-4 sm:p-6 rounded-2xl sm:rounded-[2rem]">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {review.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{review.username}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              {review.comment && (
                <p className="mt-3 text-gray-700 leading-relaxed font-medium">{review.comment}</p>
              )}
              
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                   {review.imageUrls.map((url, i) => (
                      <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-zoom-in">
                         <img src={url} alt={`Review ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </div>
                   ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4">
                {review.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle className="h-3 w-3" /> Đã mua hàng
                  </span>
                )}
                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                   Hữu ích ({Math.floor(Math.random() * 10)})
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
