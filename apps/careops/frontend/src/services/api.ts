import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '../hooks/useAuth'
import type { 
  CaregiverProfile, CaregiverFilter, 
  CarePlan, Shift, 
  ApiResponse, PaginatedResponse 
} from '../types'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - logout user
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Caregiver API
export const caregiverApi = {
  search: async (filter?: CaregiverFilter, page = 1, perPage = 10): Promise<PaginatedResponse<CaregiverProfile>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    
    if (filter) {
      if (filter.certifications?.length) params.append('certifications', filter.certifications.join(','))
      if (filter.languages?.length) params.append('languages', filter.languages.join(','))
      if (filter.specializations?.length) params.append('specializations', filter.specializations.join(','))
      if (filter.minRating) params.append('min_rating', filter.minRating.toString())
      if (filter.maxHourlyRate) params.append('max_rate', filter.maxHourlyRate.toString())
      if (filter.zipCode) params.append('zip_code', filter.zipCode)
      if (filter.availableOnly) params.append('available_only', 'true')
      if (filter.backgroundChecked) params.append('background_checked', 'true')
      if (filter.searchQuery) params.append('q', filter.searchQuery)
    }
    
    const response = await apiClient.get(`/caregivers?${params.toString()}`)
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<CaregiverProfile>> => {
    const response = await apiClient.get(`/caregivers/${id}`)
    return response.data
  },

  update: async (id: string, data: Partial<CaregiverProfile>): Promise<ApiResponse<CaregiverProfile>> => {
    const response = await apiClient.patch(`/caregivers/${id}`, data)
    return response.data
  },

  getAvailability: async (id: string, startDate: string, endDate: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/caregivers/${id}/availability`, {
      params: { start_date: startDate, end_date: endDate }
    })
    return response.data
  },
}

// Care Plan API
export const carePlanApi = {
  list: async (familyId?: string): Promise<PaginatedResponse<CarePlan>> => {
    const params = new URLSearchParams()
    if (familyId) params.append('family_id', familyId)
    
    const response = await apiClient.get(`/care-plans?${params.toString()}`)
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<CarePlan>> => {
    const response = await apiClient.get(`/care-plans/${id}`)
    return response.data
  },

  create: async (data: Omit<CarePlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CarePlan>> => {
    const response = await apiClient.post('/care-plans', data)
    return response.data
  },

  update: async (id: string, data: Partial<CarePlan>): Promise<ApiResponse<CarePlan>> => {
    const response = await apiClient.patch(`/care-plans/${id}`, data)
    return response.data
  },

  assignCaregiver: async (carePlanId: string, caregiverId: string): Promise<ApiResponse<CarePlan>> => {
    const response = await apiClient.post(`/care-plans/${carePlanId}/assign`, { caregiver_id: caregiverId })
    return response.data
  },

  cancel: async (id: string, reason: string): Promise<ApiResponse<CarePlan>> => {
    const response = await apiClient.post(`/care-plans/${id}/cancel`, { reason })
    return response.data
  },
}

// Schedule API
export const scheduleApi = {
  getShifts: async (filters?: { caregiverId?: string; carePlanId?: string; familyId?: string; startDate?: string; endDate?: string }): Promise<PaginatedResponse<Shift>> => {
    const params = new URLSearchParams()
    if (filters?.caregiverId) params.append('caregiver_id', filters.caregiverId)
    if (filters?.carePlanId) params.append('care_plan_id', filters.carePlanId)
    if (filters?.familyId) params.append('family_id', filters.familyId)
    if (filters?.startDate) params.append('start_date', filters.startDate)
    if (filters?.endDate) params.append('end_date', filters.endDate)
    
    const response = await apiClient.get(`/schedules?${params.toString()}`)
    return response.data
  },

  createShift: async (data: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Shift>> => {
    const response = await apiClient.post('/schedules', data)
    return response.data
  },

  updateShift: async (id: string, data: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    const response = await apiClient.patch(`/schedules/${id}`, data)
    return response.data
  },

  cancelShift: async (id: string, reason: string): Promise<ApiResponse<Shift>> => {
    const response = await apiClient.post(`/schedules/${id}/cancel`, { reason })
    return response.data
  },

  clockIn: async (id: string, location: { latitude: number; longitude: number }): Promise<ApiResponse<Shift>> => {
    const response = await apiClient.post(`/schedules/${id}/clock-in`, { location })
    return response.data
  },

  clockOut: async (id: string, location: { latitude: number; longitude: number }, notes?: string): Promise<ApiResponse<Shift>> => {
    const response = await apiClient.post(`/schedules/${id}/clock-out`, { location, notes })
    return response.data
  },
}

// Background Check API
export const backgroundCheckApi = {
  initiate: async (caregiverId: string, provider: 'checkr' | 'sterling'): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/background-checks', { caregiver_id: caregiverId, provider })
    return response.data
  },

  getStatus: async (caregiverId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/background-checks/${caregiverId}`)
    return response.data
  },

  getReport: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/background-checks/${id}/report`)
    return response.data
  },
}

// Payer Authorization API
export const payerAuthApi = {
  list: async (carePlanId?: string): Promise<ApiResponse<any[]>> => {
    const params = carePlanId ? `?care_plan_id=${carePlanId}` : ''
    const response = await apiClient.get(`/payer-authorizations${params}`)
    return response.data
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/payer-authorizations', data)
    return response.data
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/payer-authorizations/${id}`, data)
    return response.data
  },

  uploadDocument: async (id: string, file: File, type: string): Promise<ApiResponse<any>> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await apiClient.post(`/payer-authorizations/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
}

// Admin API
export const adminApi = {
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/dashboard-stats')
    return response.data
  },

  getPendingBackgroundChecks: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/admin/pending-background-checks')
    return response.data
  },

  getPendingAuthorizations: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/admin/pending-authorizations')
    return response.data
  },

  approveCaregiver: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/admin/caregivers/${id}/approve`)
    return response.data
  },

  getAllUsers: async (page = 1, perPage = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get(`/admin/users?page=${page}&per_page=${perPage}`)
    return response.data
  },
}

// Notification API
export const notificationApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/notifications')
    return response.data
  },

  markAsRead: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/notifications/${id}/read`)
    return response.data
  },

  markAllAsRead: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/notifications/mark-all-read')
    return response.data
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await apiClient.get('/notifications/unread-count')
    return response.data
  },
}

export default apiClient
