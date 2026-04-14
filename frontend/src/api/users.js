import api from '../utils/axios'

const API_URL = '/admin/users'

export const usersAPI = {
    getAllUsers: async () => {
        const response = await api.get(API_URL)
        return response.data
    },
    updateRole: async (id, role) => {
        const response = await api.put(`${API_URL}/${id}/role`, null, { params: { role } })
        return response.data
    },
    toggleStatus: async (id) => {
        const response = await api.put(`${API_URL}/${id}/status`)
        return response.data
    },
    deleteUser: async (id) => {
        const response = await api.delete(`${API_URL}/${id}`)
        return response.data
    }
}
