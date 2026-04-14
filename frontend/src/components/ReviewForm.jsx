import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createReview } from '../store/slices/reviewsSlice'
import { Star } from 'lucide-react'

const ReviewForm = ({ productId, onSuccess }) => {
  const dispatch = useDispatch()
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(createReview({ productId, rating, comment })).unwrap()
      setComment('')
      setRating(5)
      if (onSuccess) onSuccess()
    } catch (error) {
      alert('Đánh giá thất bại: ' + (error || 'Unknown error'))
    }
    setIsSubmitting(false)
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Viết đánh giá</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhận xét
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
