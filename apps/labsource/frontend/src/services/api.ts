import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '../hooks/useAuth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  get instance() {
    return this.client
  }
}

export const apiClient = new ApiClient().instance

// API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    organizationName: string
    organizationType: string
  }) => apiClient.post('/auth/register', data),
  
  me: () => apiClient.get('/auth/me'),
  
  refresh: () => apiClient.post('/auth/refresh'),
}

export const reagentsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get('/reagents', { params }),
  
  get: (id: string) =>
    apiClient.get(`/reagents/${id}`),
  
  search: (query: string, filters?: Record<string, unknown>) =>
    apiClient.get('/reagents/search', { params: { q: query, ...filters } }),
  
  getSubstitutes: (id: string) =>
    apiClient.get(`/reagents/${id}/substitutes`),
  
  getByCategory: (category: string) =>
    apiClient.get(`/reagents/category/${category}`),
}

export const lotsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get('/lots', { params }),
  
  get: (id: string) =>
    apiClient.get(`/lots/${id}`),
  
  getCoA: (lotId: string) =>
    apiClient.get(`/lots/${lotId}/coa`),
  
  downloadCoA: (lotId: string) =>
    apiClient.get(`/lots/${lotId}/coa/download`, { responseType: 'blob' }),
  
  getByReagent: (reagentId: string) =>
    apiClient.get(`/lots/reagent/${reagentId}`),
  
  getExpiring: (days: number = 30) =>
    apiClient.get('/lots/expiring', { params: { days } }),
  
  quarantine: (lotId: string, reason: string) =>
    apiClient.post(`/lots/${lotId}/quarantine`, { reason }),
}

export const coldChainApi = {
  getActiveShipments: () =>
    apiClient.get('/coldchain/active'),
  
  getShipment: (shipmentId: string) =>
    apiClient.get(`/coldchain/shipments/${shipmentId}`),
  
  getTemperatureLog: (shipmentId: string) =>
    apiClient.get(`/coldchain/shipments/${shipmentId}/temperature`),
  
  getAlerts: () =>
    apiClient.get('/coldchain/alerts'),
  
  acknowledgeAlert: (alertId: string) =>
    apiClient.post(`/coldchain/alerts/${alertId}/acknowledge`),
  
  getExcursionReport: (shipmentId: string) =>
    apiClient.get(`/coldchain/shipments/${shipmentId}/excursion-report`),
}

export const rfqApi = {
  list: () =>
    apiClient.get('/rfq'),
  
  get: (id: string) =>
    apiClient.get(`/rfq/${id}`),
  
  create: (data: Record<string, unknown>) =>
    apiClient.post('/rfq', data),
  
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.put(`/rfq/${id}`, data),
  
  publish: (id: string) =>
    apiClient.post(`/rfq/${id}/publish`),
  
  close: (id: string) =>
    apiClient.post(`/rfq/${id}/close`),
  
  submitQuote: (rfqId: string, data: Record<string, unknown>) =>
    apiClient.post(`/rfq/${rfqId}/quotes`, data),
  
  getQuotes: (rfqId: string) =>
    apiClient.get(`/rfq/${rfqId}/quotes`),
  
  acceptQuote: (rfqId: string, quoteId: string) =>
    apiClient.post(`/rfq/${rfqId}/quotes/${quoteId}/accept`),
}

export const ordersApi = {
  list: () =>
    apiClient.get('/orders'),
  
  get: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  getByStatus: (status: string) =>
    apiClient.get('/orders', { params: { status } }),
  
  trackShipment: (orderId: string) =>
    apiClient.get(`/orders/${orderId}/tracking`),
}

export const cliaApi = {
  listWaived: () =>
    apiClient.get('/clia/waived'),
  
  get: (productId: string) =>
    apiClient.get(`/clia/products/${productId}`),
  
  validateUse: (productId: string, labCliaNumber: string) =>
    apiClient.post(`/clia/products/${productId}/validate`, { labCliaNumber }),
}

export const adminApi = {
  getStats: () =>
    apiClient.get('/admin/stats'),
  
  getUsers: () =>
    apiClient.get('/admin/users'),
  
  getSuppliers: () =>
    apiClient.get('/admin/suppliers'),
  
  approveSupplier: (supplierId: string) =>
    apiClient.post(`/admin/suppliers/${supplierId}/approve`),
  
  getAuditLog: (params?: Record<string, unknown>) =>
    apiClient.get('/admin/audit-log', { params }),
  
  syncSaleor: () =>
    apiClient.post('/admin/sync/saleor'),
  
  getSystemHealth: () =>
    apiClient.get('/admin/health'),
}
