import api from '../utils/axios'

export const logsAPI = {
  getLogs: (params) => api.get('/admin/system-logs', { params })
}
