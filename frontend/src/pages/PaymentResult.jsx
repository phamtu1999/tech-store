import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { paymentsAPI } from '../api/payments'
import { clearCart } from '../store/slices/cartSlice'

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
        setError('Missing VNPay transaction data.')
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
        setError(requestError.response?.data?.message || 'Unable to verify payment result.')
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [dispatch, location.search])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <Loader2 className="w-12 h-12 mx-auto text-orange-500 animate-spin" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Verifying payment</h1>
          <p className="mt-2 text-gray-600">Please wait while we confirm the VNPay response.</p>
        </div>
      </div>
    )
  }

  const isSuccess = Boolean(result?.success)
  const title = isSuccess ? 'Payment successful' : 'Payment not completed'
  const description = error || result?.message || 'Your payment could not be confirmed.'
  const statusClass = isSuccess
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-red-50 text-red-700 border-red-200'

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="text-center">
          {isSuccess ? (
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
          ) : (
            <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
          )}
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-3 text-gray-600">{description}</p>
        </div>

        <div className={`mt-8 rounded-2xl border p-5 ${statusClass}`}>
          <div className="flex justify-between gap-4 py-2 border-b border-current/10">
            <span className="font-medium">Order ID</span>
            <span>{result?.orderId || '-'}</span>
          </div>
          <div className="flex justify-between gap-4 py-2 border-b border-current/10">
            <span className="font-medium">Transaction ID</span>
            <span className="break-all text-right">{result?.transactionId || '-'}</span>
          </div>
          <div className="flex justify-between gap-4 py-2 border-b border-current/10">
            <span className="font-medium">Payment status</span>
            <span>{result?.paymentStatus || 'FAILED'}</span>
          </div>
          <div className="flex justify-between gap-4 py-2 border-b border-current/10">
            <span className="font-medium">Order status</span>
            <span>{result?.orderStatus || '-'}</span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="font-medium">VNPay code</span>
            <span>{result?.responseCode || '-'}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            View orders
          </Link>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="flex-1 inline-flex items-center justify-center rounded-2xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentResult
