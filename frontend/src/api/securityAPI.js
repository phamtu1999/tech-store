import api from '../utils/axios'

export const securityAPI = {
  // Security Settings Management
  getSecuritySettings: () => {
    return api.get('/admin/security/settings')
  },

  updateSecuritySettings: (data) => {
    return api.put('/admin/security/settings', data)
  },

  // Session Management
  getActiveSessions: () => {
    return api.get('/admin/security/sessions')
  },

  terminateSession: (sessionId) => {
    return api.delete(`/admin/security/sessions/${sessionId}`)
  },

  terminateAllSessions: () => {
    return api.delete('/admin/security/sessions/all')
  },

  // Login History
  getLoginHistory: (filters = {}, page = 0, size = 10) => {
    const params = new URLSearchParams()
    
    if (filters.username) params.append('username', filters.username)
    if (filters.startDate) params.append('startDate', `${filters.startDate}T00:00:00`)
    if (filters.endDate) params.append('endDate', `${filters.endDate}T23:59:59`)
    
    // Auto populate endDate to current date if startDate is provided but no endDate
    if (filters.startDate && !filters.endDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      params.set('endDate', today.toISOString().split('.')[0]);
    }
    // Auto populate startDate to very early date if endDate is provided but no startDate
    if (filters.endDate && !filters.startDate) {
      params.set('startDate', '2000-01-01T00:00:00');
    }

    if (filters.status) params.append('status', filters.status)
    params.append('page', page)
    params.append('size', size)

    return api.get(`/admin/security/login-history?${params.toString()}`)
  },

  exportLoginHistory: (filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.username) params.append('username', filters.username)
    if (filters.startDate) params.append('startDate', `${filters.startDate}T00:00:00`)
    if (filters.endDate) params.append('endDate', `${filters.endDate}T23:59:59`)
    
    if (filters.startDate && !filters.endDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      params.set('endDate', today.toISOString().split('.')[0]);
    }
    if (filters.endDate && !filters.startDate) {
      params.set('startDate', '2000-01-01T00:00:00');
    }

    if (filters.status) params.append('status', filters.status)

    return api.get(`/admin/security/login-history/export?${params.toString()}`, {
      responseType: 'blob'
    })
  },

  // Two-Factor Authentication
  get2FAUsers: () => {
    return api.get('/admin/security/2fa/users')
  }
}
