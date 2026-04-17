import api from '../utils/axios'

export const settingsAPI = {
  getSettings: () => {
    return api.get('/settings')
  },

  updateSettings: (data) => {
    return api.put('/settings', data)
  }
}
