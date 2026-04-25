import axios from '../utils/axios'

export const loyaltyAPI = {
  getMyPoints: () => axios.get('/loyalty/my-points'),
  getMyHistory: (params) => axios.get('/loyalty/my-history', { params }),
}
