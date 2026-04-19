import api from '../utils/axios'

export const brandsAPI = {
  getAll: () => api.get('/brands'),
}
