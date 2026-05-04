import api from '../utils/axios'

export const brandsAPI = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  
  // Admin APIs
  adminGetAll: () => api.get('/admin/brands'),
  create: (data) => api.post('/admin/brands', data),
  update: (id, data) => api.put(`/admin/brands/${id}`, data),
  delete: (id) => api.delete(`/admin/brands/${id}`),
}
