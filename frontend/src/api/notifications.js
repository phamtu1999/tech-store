import api from '../utils/axios'

export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  getNotificationsPaginated: (page, size) => api.get(`/notifications/paginated?page=${page}&size=${size}`),
  getUnreadNotifications: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => api.post(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  clearAllNotifications: () => api.delete('/notifications'),
}
