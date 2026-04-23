import axios from 'axios'

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BFF_URL;
  if (envUrl) return envUrl.endsWith('/') ? `${envUrl}api/v1` : `${envUrl}/api/v1`;
  
  // Auto-detect production BFF on Railway by replacing 'frontend' with 'bff' in current URL
  if (window.location.hostname.includes('frontend-production')) {
    const bffHost = window.location.hostname.replace('frontend-production', 'bff-production');
    return `https://${bffHost}/api/v1`;
  }
  
  return 'http://localhost:3000/api/v1';
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
