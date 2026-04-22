import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Package } from 'lucide-react'
import Swal from 'sweetalert2'
import { fireError, fireSuccess } from '../utils/swalError'
import { getApiErrorMessage } from '../utils/apiError'
import { cancelOrder, fetchMyOrders, fetchOrderById, reorderOrder, confirmOrderReceipt } from '../store/slices/ordersSlice'
import { reviewsAPI } from '../api/reviews'
import { useNavigate } from 'react-router-dom'

// Sub-components
import OrderList from '../components/orders/OrderList'
import OrderDetailModal from '../components/orders/OrderDetailModal'
import ReviewModal from '../components/orders/ReviewModal'

const STATUS_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ xử lý' },
  { id: 'CONFIRMED', label: 'Đã xác nhận' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'DELIVERED', label: 'Đã giao' },
  { id: 'REVIEWED', label: 'Đã đánh giá' },
  { id: 'CANCELLED', label: 'Đã hủy' },
]

const STATUS_STYLES = {
  PENDING: 'border border-amber-200 bg-amber-50 text-amber-700',
  CONFIRMED: 'border border-blue-200 bg-blue-50 text-blue-700',
  SHIPPING: 'border border-indigo-200 bg-indigo-50 text-indigo-700',
  DELIVERED: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  REVIEWED: 'border border-primary-200 bg-primary-50 text-primary-700',
  CANCELLED: 'border border-red-200 bg-red-50 text-red-700',
}

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã nhận hàng',
  REVIEWED: 'Đã đánh giá',
  CANCELLED: 'Đã hủy',
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const Orders = ({ embedded = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, isLoading } = useSelector((state) => state.orders)

  const [activeTab, setActiveTab] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewItem, setReviewItem] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 0, size: 50 }))
  }, [dispatch])

  const filteredOrders = useMemo(() => {
    if (activeTab === 'ALL') return orders
    return orders.filter(o => o.status === activeTab)
  }, [orders, activeTab])

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Hủy đơn hàng?',
      text: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý hủy',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#ef4444'
    })

    if (result.isConfirmed) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap()
        fireSuccess('Thành công', 'Đơn hàng đã được hủy')
      } catch (err) {
        fireError(err, 'Không thể hủy đơn hàng')
      }
    }
  }

  const handleReviewSubmit = async () => {
    try {
      Swal.fire({ title: 'Đang gửi...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
      await reviewsAPI.create({ 
          productId: reviewItem.productId, 
          orderId: selectedOrder?.id,
          rating, 
          comment 
      })
      fireSuccess('Cảm ơn!', 'Đánh giá của bạn đã được ghi nhận')
      setReviewModalOpen(false)
      // Refresh orders to see the REVIEWED status
      dispatch(fetchMyOrders({ page: 0, size: 50 }))
    } catch (err) {
      fireError(err, 'Không thể gửi đánh giá')
    }
  }

  const handleConfirmReceipt = async (orderId) => {
    const result = await Swal.fire({
      title: 'Đã nhận được hàng?',
      text: 'Vui lòng chỉ xác nhận nếu bạn đã nhận đủ sản phẩm và hài lòng.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đã nhận hàng',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#10b981'
    })

    if (result.isConfirmed) {
        try {
            await dispatch(confirmOrderReceipt(orderId)).unwrap()
            fireSuccess('Thành công', 'Cảm ơn bạn đã mua hàng tại Tech Store!')
        } catch (err) {
            fireError(err, 'Có lỗi xảy ra')
        }
    }
  }

  const handleViewDetail = (orderId) => {
    dispatch(fetchOrderById(orderId)).unwrap().then(res => {
        setSelectedOrder(res.result)
        setIsDetailOpen(true)
    })
  }

  const handleReorder = (orderId) => {
    dispatch(reorderOrder(orderId)).unwrap().then(() => navigate('/cart'))
  }

  return (
    <div className={embedded ? "" : "mx-auto max-w-6xl px-4 py-6 sm:py-8"}>
      {!embedded && <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8 uppercase tracking-widest">Đơn hàng của tôi</h1>}
      
      <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide border-b border-gray-100 mb-6 sm:mb-8">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase">Đang tải đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
           <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
           <p className="text-gray-400 font-bold uppercase italic">Không tìm thấy đơn hàng nào ở trạng thái này</p>
        </div>
      ) : (
        <OrderList 
            orders={filteredOrders}
            statusStyles={STATUS_STYLES}
            statusLabels={STATUS_LABELS}
            currencyFormatter={currencyFormatter}
            onViewDetail={handleViewDetail}
            onCancelOrder={handleCancelOrder}
            onReorder={handleReorder}
            onConfirmReceipt={handleConfirmReceipt}
        />
      )}

      <OrderDetailModal 
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          order={selectedOrder}
          currencyFormatter={currencyFormatter}
          onReorder={handleReorder}
          onReview={(item) => { setReviewItem(item); setRating(5); setComment(''); setReviewModalOpen(true); }}
          navigate={navigate}
      />

      <ReviewModal 
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          item={reviewItem}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          onSubmit={handleReviewSubmit}
      />
    </div>
  )
}

export default Orders
