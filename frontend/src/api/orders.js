import api from '../utils/axios'

export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderByNumber: (orderNumber) => api.get(`/orders/order-number/${orderNumber}`),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getAllOrders: (params) => api.get('/orders', { params }),
}
