import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../store/slices/ordersSlice'
import { clearCart } from '../store/slices/cartSlice'
import { profileAPI } from '../api/profile'
import { paymentsAPI } from '../api/payments'
import Swal from 'sweetalert2'
import { fireError, fireSuccess } from '../utils/swalError'
import { getApiErrorMessage } from '../utils/apiError'

// Sub-components
import CheckoutAddress from '../components/checkout/CheckoutAddress'
import CheckoutPaymentMethods from '../components/checkout/CheckoutPaymentMethods'
import CheckoutCartSummary from '../components/checkout/CheckoutCartSummary'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { totalPrice, cartItems } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const [addresses, setAddresses] = useState([])
  const [showAddressList, setShowAddressList] = useState(false)
  const [formData, setFormData] = useState({
    receiverName: user?.fullName || '',
    receiverPhone: user?.phone || '',
    shippingAddress: '',
    note: '',
    paymentMethod: 'COD',
    couponCode: '',
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await profileAPI.getAddresses()
        const fetchedAddresses = response.data.result || []
        setAddresses(fetchedAddresses)
        
        const defaultAddr = fetchedAddresses.find(a => a.isDefault || a.default) || fetchedAddresses[0]
        if (defaultAddr) {
          setFormData(prev => ({
            ...prev,
            receiverName: defaultAddr.receiverName,
            receiverPhone: defaultAddr.phone,
            shippingAddress: `${defaultAddr.detailedAddress}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`
          }))
        }
      } catch (error) {
        console.error(getApiErrorMessage(error))
      }
    }
    fetchAddresses()
  }, [])

  const handleSelectAddress = (addr) => {
    setFormData({
      ...formData,
      receiverName: addr.receiverName,
      receiverPhone: addr.phone,
      shippingAddress: `${addr.detailedAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`
    })
    setShowAddressList(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (cartItems.length === 0) {
      fireError({ response: { data: { message: 'Giỏ hàng của bạn đang trống' } } }, undefined, 'Lỗi')
      return
    }

    if (formData.paymentMethod === 'MOMO') {
      fireSuccess('Chưa hỗ trợ', 'Momo chưa được tích hợp ở phiên bản này', { icon: 'info' })
      return
    }

    try {
      Swal.fire({ title: 'Đang xử lý...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
      
      const orderPayload = {
        ...formData,
        idempotencyKey: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      }

      const orderId = await dispatch(createOrder(orderPayload)).unwrap()

      if (formData.paymentMethod === 'VNPAY') {
        const paymentResponse = await paymentsAPI.createVnPayUrl(orderId)
        window.location.href = paymentResponse.data.result
        return
      }

      dispatch(clearCart())
      fireSuccess('Thành công', 'Đơn hàng của bạn đã được tiếp nhận')
      navigate('/orders')
    } catch (error) {
      fireError(error, 'Đặt hàng thất bại')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 sm:py-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Thanh toán</h1>
        <p className="text-sm sm:text-base text-gray-600">Vui lòng kiểm tra thông tin trước khi đặt hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CheckoutAddress 
            addresses={addresses}
            showAddressList={showAddressList}
            setShowAddressList={setShowAddressList}
            handleSelectAddress={handleSelectAddress}
            formData={formData}
            handleChange={handleChange}
          />

          <CheckoutPaymentMethods 
            paymentMethod={formData.paymentMethod}
            onChange={handleChange}
          />
        </div>

        <div className="lg:col-span-1">
          <CheckoutCartSummary 
            cartItems={cartItems}
            totalPrice={totalPrice}
            onSubmit={handleSubmit}
            couponCode={formData.couponCode}
            onCouponChange={(val) => setFormData(prev => ({ ...prev, couponCode: val }))}
          />
        </div>
      </div>
    </div>
  )
}

export default Checkout
