import api from './axios'

export const brandsAPI = {
  getAll: () => api.get('/brands'),
}
