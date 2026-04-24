import api from '../utils/axios'

export const authAPI = {
  login: (credentials) => api.post('/auth/authenticate', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/password/forgot', { email }),
  resetPassword: (data) => api.post('/auth/password/reset', data),
  verifyPassword: (password) => api.post('/auth/password/verify', { password }),
  googleLogin: () => {
    const envUrl = import.meta.env.VITE_API_URL;
    const baseUrl = envUrl
      ? envUrl.replace(/\/api\/v1\/?$/, '')
      : 'http://localhost:3000';

    const url = baseUrl.endsWith('/') ? `${baseUrl}api/v1/auth/google` : `${baseUrl}/api/v1/auth/google`;
    window.location.href = url;
  },
}
