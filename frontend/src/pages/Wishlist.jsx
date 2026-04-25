import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'
import { getProductImageSources, handleProductImageError } from '../utils/productImageFallback'

const Wishlist = ({ embedded = false }) => {
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.wishlist)
  const { isLoading: isCartLoading } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  const handleRemove = async (productId) => {
    await dispatch(removeFromWishlist(productId)).unwrap()
  }

  const handleAddToCart = async (item) => {
    if (isCartLoading) return
    try {
      await dispatch(addToCart({ variantId: item.variantId, quantity: 1 })).unwrap()
      await dispatch(removeFromWishlist(item.productId)).unwrap()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className={embedded ? "" : "mx-auto max-w-6xl px-4 py-6 sm:py-8"}>
      {!embedded && <h1 className="mb-6 text-3xl font-bold text-gray-900">Danh sách yêu thích</h1>}

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <Heart className="mx-auto mb-4 h-24 w-24 text-gray-300" />
          <p className="mb-4 text-gray-600">Danh sách yêu thích của bạn đang trống</p>
          <Link to="/products" className="btn btn-primary">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const { primary: itemImageUrl, fallback: itemImageFallback } = getProductImageSources({
              name: item.productName || item.variantName,
              imageUrl: item.productImage,
            })

            return (
              <div key={item.id} className="card">
                <div className="relative">
                  <img
                    src={itemImageUrl}
                    alt={item.productName}
                    className="h-48 w-full rounded-lg object-cover"
                    onError={(e) => handleProductImageError(e, itemImageFallback)}
                  />
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow-md hover:bg-red-50"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/${item.slug}`}
                    className="line-clamp-2 font-medium text-gray-900 hover:text-primary-600"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-2 font-bold text-primary-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.price)}
                  </p>
                  <p className={`mt-1 text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.inStock ? 'Còn hàng' : 'Hết hàng'}
                  </p>
                  {item.inStock && (
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isCartLoading}
                      className="btn btn-primary mt-3 flex w-full items-center justify-center disabled:opacity-50"
                    >
                      <ShoppingCart className={`mr-2 h-4 w-4 ${isCartLoading ? 'animate-spin' : ''}`} />
                      {isCartLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Wishlist
