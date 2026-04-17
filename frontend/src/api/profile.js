import api from '../utils/axios'

export const profileAPI = {
    getProfile: () => api.get('/profile'),
    getAddresses: () => api.get('/addresses'),
    addAddress: (data) => api.post('/addresses', data),
    updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/addresses/${id}`),
    setDefaultAddress: (id) => api.patch(`/addresses/${id}/default`),
    updateProfile: (data) => api.put('/profile', data),
    changePassword: (data) => api.post('/profile/change-password', data),
}
