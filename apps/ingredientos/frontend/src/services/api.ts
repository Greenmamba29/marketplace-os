import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Helper Functions
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then(res => res.data),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then(res => res.data),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then(res => res.data),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config).then(res => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then(res => res.data),
}

// Ingredient API
export const ingredientApi = {
  getAll: (params?: { page?: number; per_page?: number; filters?: Record<string, unknown> }) =>
    apiClient.get('/ingredients', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/ingredients/${id}`),
  
  getCategories: () =>
    apiClient.get('/ingredients/categories'),
  
  getRegulatoryStatus: (id: string) =>
    apiClient.get(`/ingredients/${id}/regulatory`),
  
  getCertifications: (id: string) =>
    apiClient.get(`/ingredients/${id}/certifications`),
  
  getAllergenProfile: (id: string) =>
    apiClient.get(`/ingredients/${id}/allergens`),
  
  search: (query: string, filters?: Record<string, unknown>) =>
    apiClient.get('/ingredients/search', { params: { q: query, ...filters } }),
}

// RFQ API
export const rfqApi = {
  getAll: (params?: { page?: number; per_page?: number; status?: string }) =>
    apiClient.get('/rfq', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/rfq/${id}`),
  
  create: (data: unknown) =>
    apiClient.post('/rfq', data),
  
  update: (id: string, data: unknown) =>
    apiClient.put(`/rfq/${id}`, data),
  
  cancel: (id: string) =>
    apiClient.post(`/rfq/${id}/cancel`),
  
  getQuotes: (rfqId: string) =>
    apiClient.get(`/rfq/${rfqId}/quotes`),
  
  selectQuote: (rfqId: string, quoteId: string) =>
    apiClient.post(`/rfq/${rfqId}/quotes/${quoteId}/select`),
}

// Quote API
export const quoteApi = {
  getById: (id: string) =>
    apiClient.get(`/quotes/${id}`),
  
  submit: (rfqId: string, data: unknown) =>
    apiClient.post(`/rfq/${rfqId}/quotes`, data),
  
  withdraw: (id: string) =>
    apiClient.post(`/quotes/${id}/withdraw`),
}

// Order API
export const orderApi = {
  getAll: (params?: { page?: number; per_page?: number; status?: string }) =>
    apiClient.get('/orders', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  create: (quoteId: string) =>
    apiClient.post('/orders', { quote_id: quoteId }),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/orders/${id}/status`, { status }),
  
  getDocuments: (id: string) =>
    apiClient.get(`/orders/${id}/documents`),
}

// Regulatory API
export const regulatoryApi = {
  getGRASStatus: (ingredientId: string) =>
    apiClient.get(`/regulatory/gras/${ingredientId}`),
  
  getCertifications: (ingredientId: string) =>
    apiClient.get(`/regulatory/certifications/${ingredientId}`),
  
  getAllergenProfile: (ingredientId: string) =>
    apiClient.get(`/regulatory/allergens/${ingredientId}`),
  
  getFunctionalClaims: (ingredientId: string) =>
    apiClient.get(`/regulatory/claims/${ingredientId}`),
  
  getComplianceDocuments: (ingredientId: string) =>
    apiClient.get(`/regulatory/documents/${ingredientId}`),
  
  verifyGRAS: (ingredientId: string) =>
    apiClient.post(`/regulatory/gras/${ingredientId}/verify`),
}

// Admin API
export const adminApi = {
  getStats: () =>
    apiClient.get('/admin/stats'),
  
  getPendingVerifications: () =>
    apiClient.get('/admin/verifications/pending'),
  
  verifyIngredient: (id: string) =>
    apiClient.post(`/admin/ingredients/${id}/verify`),
  
  verifySupplier: (id: string) =>
    apiClient.post(`/admin/suppliers/${id}/verify`),
  
  getComplianceAlerts: () =>
    apiClient.get('/admin/compliance/alerts'),
  
  getUsers: (params?: { page?: number; per_page?: number }) =>
    apiClient.get('/admin/users', { params }),
}

// Dashboard API
export const dashboardApi = {
  getBuyerStats: () =>
    apiClient.get('/dashboard/buyer/stats'),
  
  getBuyerOrders: () =>
    apiClient.get('/dashboard/buyer/orders'),
  
  getBuyerRFQs: () =>
    apiClient.get('/dashboard/buyer/rfqs'),
  
  getSupplierStats: () =>
    apiClient.get('/dashboard/supplier/stats'),
  
  getSupplierQuotes: () =>
    apiClient.get('/dashboard/supplier/quotes'),
}

export default api
