import api from '../utils/axios'

export const paymentsAPI = {
  createVnPayUrl: (orderId) => api.get(`/payments/vnpay/create-url/${orderId}`),
  verifyVnPayReturn: (searchParams) => api.get(`/payments/vnpay/return?${searchParams.toString()}`),
}
