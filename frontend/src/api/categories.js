import api from '../utils/axios'

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getTree: () => api.get('/categories/tree'),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  activateAll: () => api.post('/categories/admin/activate-all'),
  updateSortOrder: (sortRequests) => api.patch('/categories/admin/sort-order', sortRequests),
}
