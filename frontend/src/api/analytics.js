import api from '../utils/axios'

export const analyticsAPI = {
  getDashboardStats: (period = '30d') => api.get(`/admin/analytics/dashboard?period=${period}`),
  getAnalytics: () => api.get('/admin/analytics/dashboard'),
  exportReport: (period = '30d') => api.get(`/admin/analytics/export?period=${period}`, { responseType: 'blob' })
}
