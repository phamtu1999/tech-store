import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { addToCart } from '../store/slices/cartSlice'

const Wishlist = () => {
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.wishlist)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  const handleRemove = async (productId) => {
    await dispatch(removeFromWishlist(productId)).unwrap()
  }

  const handleAddToCart = async (productId) => {
    await dispatch(addToCart({ productId, quantity: 1 })).unwrap()
    await dispatch(removeFromWishlist(productId)).unwrap()
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Danh sách yêu thích</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Danh sách yêu thích của bạn đang trống</p>
          <Link to="/products" className="btn btn-primary">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card">
              <div className="relative">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                >
                  {item.productName}
                </Link>
                <p className="text-primary-600 font-bold mt-2">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.price)}
                </p>
                <p className={`text-sm mt-1 ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {item.inStock ? 'Còn hàng' : 'Hết hàng'}
                </p>
                {item.inStock && (
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="w-full mt-3 btn btn-primary flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
