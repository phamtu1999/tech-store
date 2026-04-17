import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react'
import { fetchCart, removeFromCart, updateCartItem } from '../store/slices/cartSlice'
import { getProductImageSources, handleProductImageError } from '../utils/productImageFallback'
import Swal from 'sweetalert2'
import Toast from '../components/Toast'

const Cart = () => {
  const dispatch = useDispatch()
  const { cartItems, totalPrice, totalItems, isLoading } = useSelector((state) => state.cart)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleRemoveItem = (itemId, productName) => {
    Swal.fire({
      title: 'Xóa sản phẩm?',
      text: `Bạn có chắc muốn bỏ "${productName}" khỏi giỏ hàng?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đúng, xóa nó!',
      cancelButtonText: 'Hủy bỏ',
      background: '#fff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(itemId))
        setToast({ message: 'Đã xóa sản phẩm khỏi giỏ hàng', type: 'info' })
      }
    })
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, item: { quantity: newQuantity } }))
    } else {
      const item = cartItems.find(i => i.id === itemId)
      handleRemoveItem(itemId, item?.productName)
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
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Giỏ hàng</h1>

      {cartItems.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingCart className="mx-auto mb-4 h-24 w-24 text-gray-300" />
          <p className="mb-4 text-gray-600">Giỏ hàng của bạn đang trống</p>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => {
              const { primary: itemImageUrl, fallback: itemImageFallback } = getProductImageSources({
                name: item.productName || item.variantName,
                imageUrl: item.imageUrl,
              })

              return (
                <div key={item.id} className="card">
                  <div className="flex items-center space-x-4">
                    <img
                      src={itemImageUrl}
                      alt={item.productName}
                      className="h-24 w-24 rounded-lg object-cover"
                      onError={(e) => handleProductImageError(e, itemImageFallback)}
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500">Phiên bản: {item.variantName}</p>
                      <p className="font-bold text-primary-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="rounded border p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="rounded border p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.subTotal)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id, item.productName)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card h-fit">
            <h2 className="mb-4 text-xl font-bold">Tóm tắt đơn hàng</h2>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span>Tổng số sản phẩm:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>30.000₫</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 mt-2">
                <span className="text-base font-black text-secondary-900">Tổng cộng:</span>
                <span className="text-2xl font-black text-primary-600 tracking-tighter">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(totalPrice + 30000)}
                </span>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-black py-5 px-8 rounded-3xl shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-6">
              <span>Tiến hành thanh toán</span>
            </Link>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Cart
