import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('agroops_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as { message?: string })?.message || error.message
    
    if (error.response?.status === 401) {
      localStorage.removeItem('agroops_token')
      window.location.href = '/login'
      toast.error('Session expired. Please log in again.')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (message) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    company_name?: string
    state: string
    role: 'buyer' | 'supplier'
  }) => api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
  
  refreshToken: () => api.post('/auth/refresh'),
}

// Inputs/Products API
export const inputsApi = {
  getAll: (params?: {
    page?: number
    per_page?: number
    category?: string
    search?: string
    state?: string
    crop?: string
    formulation?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
  }) => api.get('/inputs', { params }),
  
  getById: (id: string) => api.get(`/inputs/${id}`),
  
  getByCategory: (category: string, params?: object) =>
    api.get(`/inputs/category/${category}`, { params }),
  
  getFeatured: () => api.get('/inputs/featured'),
  
  getRelated: (id: string, cropType?: string) =>
    api.get(`/inputs/${id}/related`, { params: { crop_type: cropType } }),
    
  checkStateRegistration: (id: string, state: string) =>
    api.get(`/inputs/${id}/registration/${state}`),
}

// Agronomy API
export const agronomyApi = {
  getRecommendations: (params: {
    crop_id: string
    growth_stage?: string
    soil_type?: string
    planting_date?: string
    acres?: number
    state: string
  }) => api.post('/agronomy/recommendations', params),
  
  getCrops: () => api.get('/agronomy/crops'),
  
  getCropById: (id: string) => api.get(`/agronomy/crops/${id}`),
  
  getGrowthStages: (cropId: string) =>
    api.get(`/agronomy/crops/${cropId}/growth-stages`),
  
  getWeatherForecast: (params: {
    lat: number
    lon: number
    days?: number
  }) => api.get('/agronomy/weather', { params }),
  
  getGDD: (params: {
    crop_id: string
    planting_date: string
    location: string
  }) => api.get('/agronomy/gdd', { params }),
}

// RFQ API
export const rfqApi = {
  getAll: (params?: {
    page?: number
    per_page?: number
    status?: string
    my_rfqs?: boolean
  }) => api.get('/rfq', { params }),
  
  getById: (id: string) => api.get(`/rfq/${id}`),
  
  create: (data: object) => api.post('/rfq', data),
  
  update: (id: string, data: object) => api.patch(`/rfq/${id}`, data),
  
  publish: (id: string) => api.post(`/rfq/${id}/publish`),
  
  cancel: (id: string) => api.post(`/rfq/${id}/cancel`),
  
  delete: (id: string) => api.delete(`/rfq/${id}`),
  
  getQuotes: (id: string) => api.get(`/rfq/${id}/quotes`),
  
  award: (rfqId: string, quoteId: string) =>
    api.post(`/rfq/${rfqId}/award`, { quote_id: quoteId }),
}

// Quotes API
export const quotesApi = {
  getAll: (params?: {
    page?: number
    per_page?: number
    status?: string
    my_quotes?: boolean
  }) => api.get('/quotes', { params }),
  
  getById: (id: string) => api.get(`/quotes/${id}`),
  
  submit: (rfqId: string, data: object) =>
    api.post(`/quotes/rfq/${rfqId}`, data),
  
  update: (id: string, data: object) => api.patch(`/quotes/${id}`, data),
  
  withdraw: (id: string) => api.post(`/quotes/${id}/withdraw`),
}

// Orders API
export const ordersApi = {
  getAll: (params?: {
    page?: number
    per_page?: number
    status?: string
  }) => api.get('/orders', { params }),
  
  getById: (id: string) => api.get(`/orders/${id}`),
  
  createFromQuote: (quoteId: string) =>
    api.post('/orders', { quote_id: quoteId }),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
  
  getDocuments: (id: string) => api.get(`/orders/${id}/documents`),
}

// EPA API
export const epaApi = {
  search: (params: {
    query?: string
    epa_number?: string
    company_name?: string
    active_ingredient?: string
    state?: string
  }) => api.get('/epa/search', { params }),
  
  getByNumber: (epaNumber: string) =>
    api.get(`/epa/registration/${epaNumber}`),
  
  getStateStatus: (epaNumber: string, state: string) =>
    api.get(`/epa/registration/${epaNumber}/state/${state}`),
  
  verifyProduct: (productId: string, state: string) =>
    api.get(`/epa/verify/${productId}/${state}`),
}

// Dashboard API
export const dashboardApi = {
  getBuyerStats: () => api.get('/dashboard/buyer/stats'),
  
  getSupplierStats: () => api.get('/dashboard/supplier/stats'),
  
  getRecentActivity: () => api.get('/dashboard/activity'),
  
  getSeasonalForecast: (params?: {
    crop_type?: string
    region?: string
  }) => api.get('/dashboard/seasonal-forecast', { params }),
}

// Admin API
export const adminApi = {
  getUsers: (params?: object) => api.get('/admin/users', { params }),
  
  getSuppliers: (params?: object) => api.get('/admin/suppliers', { params }),
  
  verifySupplier: (id: string) => api.post(`/admin/suppliers/${id}/verify`),
  
  getInputs: (params?: object) => api.get('/admin/inputs', { params }),
  
  approveInput: (id: string) => api.post(`/admin/inputs/${id}/approve`),
  
  getRFQs: (params?: object) => api.get('/admin/rfqs', { params }),
  
  getOrders: (params?: object) => api.get('/admin/orders', { params }),
  
  getAnalytics: () => api.get('/admin/analytics'),
  
  updateEPAData: () => api.post('/admin/epa/sync'),
}

export default api
