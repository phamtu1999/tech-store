import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviewsByProduct } from '../store/slices/reviewsSlice'
import { Star } from 'lucide-react'

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
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="card">
          <div className="flex items-start space-x-4">
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
                <p className="mt-2 text-gray-700">{review.comment}</p>
              )}
              {review.verified && (
                <span className="inline-block mt-2 text-xs text-green-600 font-medium">
                  ✓ Đã mua hàng
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
