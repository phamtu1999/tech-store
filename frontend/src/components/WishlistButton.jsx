import { Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'

const WishlistButton = ({ productId }) => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.wishlist)
  
  const isInWishlist = items.some((item) => item.productId === productId)
  
  const handleToggle = async () => {
    if (isInWishlist) {
      await dispatch(removeFromWishlist(productId)).unwrap()
    } else {
      await dispatch(addToWishlist(productId)).unwrap()
    }
  }
  
  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${
        isInWishlist
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>
  )
}

export default WishlistButton
