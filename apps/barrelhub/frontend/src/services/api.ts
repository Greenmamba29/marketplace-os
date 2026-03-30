import axios, { AxiosError, AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import type { ApiError } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

class ApiService {
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
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.detail || error.message || 'An error occurred'
        
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          toast.error('Session expired. Please log in again.')
          window.location.href = '/'
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action')
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.')
        } else {
          toast.error(message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  get instance() {
    return this.client
  }
}

export const apiService = new ApiService()
export const api = apiService.instance

// Barrel API
export const barrelsApi = {
  getAll: (params?: Record<string, unknown>) => 
    api.get('/barrels', { params }),
  
  getById: (id: string) => 
    api.get(`/barrels/${id}`),
  
  getByNumber: (barrelNumber: string) => 
    api.get(`/barrels/number/${barrelNumber}`),
  
  search: (query: string, filters?: Record<string, unknown>) => 
    api.get('/barrels/search', { params: { q: query, ...filters } }),
  
  getFilters: () => 
    api.get('/barrels/filters'),
}

// Registry API
export const registryApi = {
  getAll: (params?: Record<string, unknown>) => 
    api.get('/registry', { params }),
  
  getByBarrelId: (barrelId: string) => 
    api.get(`/registry/barrel/${barrelId}`),
  
  getHistory: (barrelId: string) => 
    api.get(`/registry/barrel/${barrelId}/history`),
  
  addSample: (barrelId: string, data: Record<string, unknown>) => 
    api.post(`/registry/barrel/${barrelId}/sample`, data),
  
  recordMovement: (barrelId: string, data: Record<string, unknown>) => 
    api.post(`/registry/barrel/${barrelId}/movement`, data),
}

// Sensory API
export const sensoryApi = {
  getAll: (params?: Record<string, unknown>) => 
    api.get('/sensory', { params }),
  
  getByBarrelId: (barrelId: string) => 
    api.get(`/sensory/barrel/${barrelId}`),
  
  getById: (id: string) => 
    api.get(`/sensory/${id}`),
  
  create: (data: Record<string, unknown>) => 
    api.post('/sensory', data),
  
  getScoreDistribution: (spiritType?: string) => 
    api.get('/sensory/distribution', { params: { spirit_type: spiritType } }),
}

// Market Comps API
export const marketCompsApi = {
  getAll: (params?: Record<string, unknown>) => 
    api.get('/market-comps', { params }),
  
  getPriceTrends: (spiritType: string, months?: number) => 
    api.get('/market-comps/trends', { params: { spirit_type: spiritType, months } }),
  
  getPriceStats: (params?: Record<string, unknown>) => 
    api.get('/market-comps/stats', { params }),
  
  getComparables: (barrelId: string) => 
    api.get(`/market-comps/comparables/${barrelId}`),
}

// RFQ API
export const rfqApi = {
  getAll: (params?: Record<string, unknown>) => 
    api.get('/rfq', { params }),
  
  getById: (id: string) => 
    api.get(`/rfq/${id}`),
  
  create: (data: Record<string, unknown>) => 
    api.post('/rfq', data),
  
  update: (id: string, data: Record<string, unknown>) => 
    api.put(`/rfq/${id}`, data),
  
  submit: (id: string) => 
    api.post(`/rfq/${id}/submit`),
  
  cancel: (id: string) => 
    api.post(`/rfq/${id}/cancel`),
  
  getQuotes: (rfqId: string) => 
    api.get(`/rfq/${rfqId}/quotes`),
}

// TTB Compliance API
export const ttbApi = {
  verifyPermit: (permitNumber: string) => 
    api.get(`/ttb/verify/${permitNumber}`),
  
  getPermitDetails: (permitNumber: string) => 
    api.get(`/ttb/permit/${permitNumber}`),
  
  searchPermits: (query: string) => 
    api.get('/ttb/search', { params: { q: query } }),
}

// Admin API
export const adminApi = {
  getDashboardStats: () => 
    api.get('/admin/stats'),
  
  getUsers: (params?: Record<string, unknown>) => 
    api.get('/admin/users', { params }),
  
  getPendingVerifications: () => 
    api.get('/admin/pending-verifications'),
  
  verifyUser: (userId: string) => 
    api.post(`/admin/users/${userId}/verify`),
  
  getAuditLog: (params?: Record<string, unknown>) => 
    api.get('/admin/audit-log', { params }),
}

export default api
