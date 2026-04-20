import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createReview } from '../store/slices/reviewsSlice'
import { Star, Camera, X, ImageIcon, Loader2 } from 'lucide-react'
import { filesAPI } from '../api/files'

const ReviewForm = ({ productId, onSuccess }) => {
  const dispatch = useDispatch()
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const fileInputRef = useRef(null)
  const [images, setImages] = useState([]) // Objects { file, url, isUploading }
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newImages = files.map(file => ({
      file,
      localUrl: URL.createObjectURL(file),
      isUploading: true
    }))

    setImages(prev => [...prev, ...newImages])

    for (let i = 0; i < newImages.length; i++) {
      try {
        const response = await filesAPI.upload(newImages[i].file, 'reviews')
        const uploadedUrl = response.data.result
        
        setImages(prev => prev.map(img => 
          img.localUrl === newImages[i].localUrl 
            ? { ...img, url: uploadedUrl, isUploading: false } 
            : img
        ))
      } catch (error) {
        console.error('File upload failed:', error)
        setImages(prev => prev.filter(img => img.localUrl !== newImages[i].localUrl))
      }
    }
  }

  const removeImage = (localUrl) => {
    setImages(prev => prev.filter(img => img.localUrl !== localUrl))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (images.some(img => img.isUploading)) {
      alert('Vui lòng đợi ảnh upload xong')
      return
    }

    setIsSubmitting(true)
    try {
      const imageUrls = images.map(img => img.url).filter(Boolean)
      await dispatch(createReview({ productId, rating, comment, imageUrls })).unwrap()
      setComment('')
      setRating(5)
      setImages([])
      if (onSuccess) onSuccess()
    } catch (error) {
      alert('Đánh giá thất bại: ' + (error || 'Unknown error'))
    }
    setIsSubmitting(false)
  }

  return (
    <div className="card p-4 sm:p-6 rounded-2xl sm:rounded-[2rem]">
      <h3 className="text-lg sm:text-xl font-black mb-4 text-secondary-900">Viết đánh giá</h3>
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

        <div>
          <label className="block text-xs font-black text-secondary-800 uppercase tracking-widest mb-3">
             Hình ảnh thực tế (Nếu có)
          </label>
          <div className="flex flex-wrap gap-3">
             {images.map((img) => (
                <div key={img.localUrl} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 group">
                   <img src={img.localUrl} alt="Preview" className="w-full h-full object-cover" />
                   {img.isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <Loader2 className="h-5 w-5 text-white animate-spin" />
                      </div>
                   )}
                   <button 
                      type="button"
                      onClick={() => removeImage(img.localUrl)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X className="w-3 h-3" />
                   </button>
                </div>
             ))}
             <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-600 transition-all bg-gray-50/50"
             >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">Thêm ảnh</span>
             </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept="image/*"
             />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || images.some(i => i.isUploading)}
          className="w-full bg-secondary-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-black/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gửi đánh giá ngay'}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
