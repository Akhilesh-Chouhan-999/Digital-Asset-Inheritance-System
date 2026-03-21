import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we're not on the login/register page and get a 401
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/forgot-password') && !currentPath.includes('/reset-password')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword, confirmPassword) => api.post(`/auth/reset-password/${token}`, { newPassword, confirmPassword }),
  refreshToken: () => api.post('/auth/refresh-token'),
}

export const assetService = {
  getAssets: (filters) => api.get('/assets', { params: filters }),
  getAssetById: (id) => api.get(`/assets/${id}`),
  createAsset: (data) => api.post('/assets', data),
  updateAsset: (id, data) => api.put(`/assets/${id}`, data),
  deleteAsset: (id) => api.delete(`/assets/${id}`),
  shareAsset: (id, nomineeId) => api.post(`/assets/${id}/share`, { nomineeId }),
  archiveAsset: (id) => api.post(`/assets/${id}/archive`),
}

export const nomineeService = {
  getNominees: () => api.get('/nominees'),
  addNominee: (data) => api.post('/nominees', data),
  updateNominee: (id, data) => api.put(`/nominees/${id}`, data),
  deleteNominee: (id) => api.delete(`/nominees/${id}`),
  verifyNominee: (id, token) => api.get(`/nominees/${id}/verify?token=${token}`),
}

export const inactivityService = {
  getStatus: () => api.get('/inactivity/status'),
  markActive: () => api.post('/inactivity/mark-active'),
  getHistory: () => api.get('/inactivity/history'),
  triggerInheritance: () => api.post('/inactivity/trigger'),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUserManagement: (params) => api.get('/admin/users', { params }),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  updateConfig: (config) => api.post('/admin/config', config),
}

export default api
