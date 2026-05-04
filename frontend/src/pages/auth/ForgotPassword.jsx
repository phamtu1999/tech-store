import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../api/auth'
import { Mail, ArrowLeft } from 'lucide-react'
import { getApiErrorMessage } from '../../utils/apiError'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      await authAPI.forgotPassword(email)
      setMessage('Link reset mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra email.')
      setEmail('')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại đăng nhập
        </Link>
        
        <div className="card">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
            <p className="mt-2 text-gray-600">
              Nhập email của bạn để nhận link reset mật khẩu
            </p>
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi link reset'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Nhớ lại mật khẩu?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
