import api from '../utils/axios'

export const backupAPI = {
  getBackups: () => api.get('/admin/backups'),
  createBackup: () => api.post('/admin/backups', {}, { timeout: 120000 }),
  uploadBackup: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/backups/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  downloadFile: (fileName) => api.get(`/admin/backups/download/${fileName}`, { responseType: 'blob' }),
  deleteBackup: (fileName) => api.delete(`/admin/backups/${fileName}`),
  restoreBackup: (fileName) => api.post(`/admin/backups/restore/${fileName}`),
  cleanupBackups: () => api.post('/admin/backups/cleanup'),
  downloadUrl: (fileName) => api.getUri({ url: `/admin/backups/download/${fileName}` })
}
