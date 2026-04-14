import api from '../utils/axios'

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getAnalytics: (startDate, endDate) => api.get('/analytics', { params: { startDate, endDate } }),
}
