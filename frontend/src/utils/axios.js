import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor to unwrap ApiResponse payloads and handle errors
api.interceptors.response.use(
  (response) => {
    if (response.config?.responseType === 'blob') {
      return response
    }

    if (isApiEnvelope(response.data)) {
      response.data = response.data.result
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
