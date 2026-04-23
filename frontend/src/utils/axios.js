import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api/v1`
  
  // Auto-detect production backend on Railway
  if (window.location.hostname.includes('railway.app')) {
    return 'https://backend-production-86d7.up.railway.app/api/v1'
  }
  
  return '/api/v1'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// BFF Instance
export const bffApi = axios.create({
  baseURL: import.meta.env.VITE_BFF_URL || 'http://localhost:5000/api/bff',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

const isApiEnvelope = (data) => {
  return data && typeof data === 'object' && 'code' in data && 'result' in data
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors and status codes
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const publicPaths = [
      '/public/',
      '/settings',
      '/auth/',
      '/products',
      '/categories',
      '/brands',
      '/recommendations',
      '/trending',
      '/flash-sales'
    ]
    const isPublicPath = publicPaths.some(path => error.config?.url?.includes(path))

    if (error.response?.status === 401 && !isPublicPath) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
