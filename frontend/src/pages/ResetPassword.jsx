import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/auth'
import { Lock, CheckCircle } from 'lucide-react'
import { getApiErrorMessage } from '../utils/apiError'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError(getApiErrorMessage({ response: { data: { message: 'Token không hợp lệ hoặc đã hết hạn' } } }))
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError(getApiErrorMessage({ response: { data: { message: 'Mật khẩu xác nhận không khớp' } } }))
      return
    }
    
    if (password.length < 6) {
      setError(getApiErrorMessage({ response: { data: { message: 'Mật khẩu phải có ít nhất 6 ký tự' } } }))
      return
    }
    
    setIsLoading(true)
    
    try {
      await authAPI.resetPassword({ token, password })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
    
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mật khẩu đã thay đổi!</h2>
            <p className="text-gray-600 mb-4">
              Mật khẩu của bạn đã được reset thành công.
            </p>
            <p className="text-sm text-gray-500">
              Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
            <p className="mt-2 text-gray-600">
              Nhập mật khẩu mới của bạn
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!token && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Token không hợp lệ hoặc đã hết hạn
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input"
                placeholder="•••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="input"
                placeholder="•••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link to="/login" className="text-primary-600 hover:text-primary-700">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
