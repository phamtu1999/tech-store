import api from '../utils/axios'

const API_URL = '/admin/users'

export const usersAPI = {
    getAllUsers: () => api.get(API_URL),
    getUsers: (params) => api.get(API_URL, { params }),
    filterUsers: (filters) => api.post(`${API_URL}/filter`, filters),
    createUser: (userData) => api.post(API_URL, userData),
    updateRole: (id, role) => api.put(`${API_URL}/${id}/role`, null, { params: { role } }),
    toggleStatus: (id) => api.put(`${API_URL}/${id}/status`),
    lockUser: (id) => api.put(`${API_URL}/${id}/lock`),
    unlockUser: (id) => api.put(`${API_URL}/${id}/unlock`),
    resetPassword: (id, newPassword) => api.put(`${API_URL}/${id}/password`, null, { params: { newPassword } }),
    deleteUser: (id) => api.delete(`${API_URL}/${id}`)
}
