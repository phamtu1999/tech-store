import api from '../utils/axios'

export const authAPI = {
  login: (credentials) => api.post('/auth/authenticate', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/password/forgot', { email }),
  resetPassword: (data) => api.post('/auth/password/reset', data),
  verifyPassword: (password) => api.post('/auth/password/verify', { password }),
}
