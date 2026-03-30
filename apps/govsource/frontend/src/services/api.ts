import axios from 'axios'
import { useAuthStore } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred'
    
    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear auth and redirect
        useAuthStore.getState().logout()
        window.location.href = '/login'
        toast.error('Session expired. Please log in again.')
        break
      case 403:
        toast.error('You do not have permission to perform this action.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 422:
        // Validation errors
        const details = error.response?.data?.error?.details
        if (details) {
          Object.entries(details).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errors.forEach((err) => toast.error(`${field}: ${err}`))
            }
          })
        } else {
          toast.error(message)
        }
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        toast.error(message)
    }

    return Promise.reject(error)
  }
)

// SAM.gov API integration
export const samGovApi = {
  search: async (params: {
    uei?: string
    cageCode?: string
    legalBusinessName?: string
    naicsCode?: string
    state?: string
    registrationStatus?: string
  }) => {
    const response = await api.post('/samgov/search', params)
    return response.data
  },

  getEntity: async (uei: string) => {
    const response = await api.get(`/samgov/entity/${uei}`)
    return response.data
  },

  getExclusions: async (params: { duns?: string; cageCode?: string }) => {
    const response = await api.post('/samgov/exclusions', params)
    return response.data
  },
}

// File upload helper
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data.url
}
