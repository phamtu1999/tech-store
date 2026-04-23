import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.VITE_BFF_URL) return `${import.meta.env.VITE_BFF_URL}/api/v1`
  
  // Auto-detect production BFF on Railway
  if (window.location.hostname.includes('railway.app')) {
    // Replace this with your actual BFF Railway URL
    return 'https://bff-production.up.railway.app/api/v1' 
  }
  
  return 'http://localhost:3000/api/v1'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  withCredentials: true, // Crucial for HttpOnly Cookies
  headers: {
    'Content-Type': 'application/json',
  },
})


const isApiEnvelope = (data) => {
  return data && typeof data === 'object' && 'code' in data && 'result' in data
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
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
