import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AlertCircle, CheckCircle2, Loader2, Home, Package, ArrowRight, RefreshCcw } from 'lucide-react'
import { paymentsAPI } from '../../api/payments'
import { clearCart } from '../../store/slices/cartSlice'

const PaymentResult = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search)
      if (!params.get('vnp_TxnRef')) {
        setError('Không tìm thấy dữ liệu giao dịch từ VNPay.')
        setIsLoading(false)
        return
      }

      try {
        const response = await paymentsAPI.verifyVnPayReturn(params)
        const paymentResult = response.data?.result
        setResult(paymentResult)

        if (paymentResult?.success) {
          dispatch(clearCart())
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Không thể xác thực kết quả thanh toán.')
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [dispatch, location.search])

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-12 shadow-2xl shadow-orange-500/5 text-center max-w-lg w-full">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 mx-auto text-orange-500 animate-spin relative z-10" />
          </div>
          <h1 className="mt-8 text-3xl font-black text-gray-900 tracking-tight">Đang xác thực...</h1>
          <p className="mt-3 text-gray-500 font-medium">Vui lòng đợi trong giây lát khi chúng tôi xác nhận phản hồi từ hệ thống VNPay.</p>
        </div>
      </div>
    )
  }

  const isSuccess = Boolean(result?.success)
  const title = isSuccess ? 'Thanh toán thành công!' : 'Thanh toán chưa hoàn tất'
  const description = error || result?.message || 'Giao dịch của bạn không thể xác nhận lúc này.'
  
  return (
    <div className="min-h-[90vh] py-12 px-4 bg-gradient-to-br from-gray-50 via-white to-orange-50/20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Header Status */}
          <div className={`p-12 text-center relative overflow-hidden ${isSuccess ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            
            {isSuccess ? (
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150"></div>
                <CheckCircle2 className="w-24 h-24 mx-auto text-emerald-500 relative z-10 drop-shadow-sm" />
              </div>
            ) : (
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150"></div>
                <AlertCircle className="w-24 h-24 mx-auto text-red-500 relative z-10 drop-shadow-sm" />
              </div>
            )}
            
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{title}</h1>
            <p className="text-lg text-gray-600 font-medium max-w-md mx-auto leading-relaxed">{description}</p>
          </div>

          {/* Transaction Details */}
          <div className="px-12 pb-12">
            <div className="bg-gray-50/80 rounded-[2rem] border border-gray-100 p-8 space-y-5">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Chi tiết giao dịch</h3>
              
              <div className="flex justify-between items-center group">
                <span className="text-gray-500 font-semibold">Mã đơn hàng</span>
                <span className="text-gray-900 font-black tracking-tight group-hover:text-orange-600 transition-colors">#{result?.orderId?.substring(0, 8).toUpperCase() || '-'}</span>
              </div>
              
              <div className="flex justify-between items-start gap-8 py-4 border-y border-gray-200/50">
                <span className="text-gray-500 font-semibold flex-shrink-0">Mã giao dịch</span>
                <span className="text-gray-900 font-bold break-all text-right text-sm font-mono">{result?.transactionId || '-'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-semibold">Trạng thái thanh toán</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                  isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {result?.paymentStatus || 'FAILED'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-semibold">Phương thức</span>
                <span className="text-gray-900 font-bold flex items-center gap-2">
                  <img src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/vnpay-logo.png" className="h-4" alt="VNPay" />
                  VNPay
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 font-semibold">Tổng tiền</span>
                <span className="text-xl font-black text-orange-600">
                  {result?.amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.amount) : '-'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/orders"
                className="group flex items-center justify-center gap-2 rounded-[1.5rem] bg-gray-900 px-8 py-5 font-black text-white hover:bg-gray-800 transition-all hover:shadow-2xl hover:shadow-gray-900/20 active:scale-95"
              >
                <Package className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                Quản lý đơn hàng
              </Link>
              
              {isSuccess ? (
                <Link
                  to="/"
                  className="group flex items-center justify-center gap-2 rounded-[1.5rem] bg-orange-500 px-8 py-5 font-black text-white hover:bg-orange-600 transition-all hover:shadow-2xl hover:shadow-orange-500/20 active:scale-95"
                >
                  <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  Về trang chủ
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => navigate('/checkout')}
                  className="group flex items-center justify-center gap-2 rounded-[1.5rem] bg-orange-500 px-8 py-5 font-black text-white hover:bg-orange-600 transition-all hover:shadow-2xl hover:shadow-orange-500/20 active:scale-95"
                >
                  <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Thử lại ngay
                </button>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-400 font-medium text-sm">
          Bạn cần hỗ trợ? Liên hệ <span className="text-gray-900 font-bold">1900 1234</span>
        </p>
      </div>
    </div>
  )
}

export default PaymentResult
