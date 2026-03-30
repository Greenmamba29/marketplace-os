import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CaregiverProfile, CaregiverFilter, PaginatedResponse, ApiResponse } from '../types'
import { caregiverApi } from '../services/api'

// Mock data for development
const mockCaregivers: CaregiverProfile[] = [
  {
    id: '1',
    userId: 'c1',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '(555) 234-5678',
    certifications: ['CNA', 'HHA'],
    languages: ['English', 'Spanish'],
    specializations: ['dementia', 'mobility'],
    yearsExperience: 8,
    hourlyRate: 28,
    status: 'available',
    bio: 'Compassionate CNA with 8 years of experience in elderly care. Specialized in dementia care and mobility assistance.',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    backgroundCheckStatus: 'completed',
    backgroundCheckCompletedAt: '2024-01-15T00:00:00Z',
    backgroundCheckProvider: 'checkr',
    serviceArea: {
      zipCodes: ['90210', '90211', '90212'],
      radius: 15,
      city: 'Beverly Hills',
      state: 'CA',
    },
    availability: {
      monday: { available: true, startTime: '08:00', endTime: '18:00' },
      tuesday: { available: true, startTime: '08:00', endTime: '18:00' },
      wednesday: { available: true, startTime: '08:00', endTime: '18:00' },
      thursday: { available: true, startTime: '08:00', endTime: '18:00' },
      friday: { available: true, startTime: '08:00', endTime: '18:00' },
      saturday: { available: false },
      sunday: { available: false },
    },
    rating: 4.9,
    reviewCount: 47,
    completedShifts: 312,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    userId: 'c2',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 345-6789',
    certifications: ['RN', 'LPN'],
    languages: ['English'],
    specializations: ['post-surgical', 'medication'],
    yearsExperience: 12,
    hourlyRate: 45,
    status: 'available',
    bio: 'Registered Nurse with extensive experience in post-surgical care and medication management.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    backgroundCheckStatus: 'completed',
    backgroundCheckCompletedAt: '2024-02-01T00:00:00Z',
    backgroundCheckProvider: 'sterling',
    serviceArea: {
      zipCodes: ['10001', '10002', '10003', '10011'],
      radius: 10,
      city: 'New York',
      state: 'NY',
    },
    availability: {
      monday: { available: true, startTime: '07:00', endTime: '19:00' },
      tuesday: { available: true, startTime: '07:00', endTime: '19:00' },
      wednesday: { available: true, startTime: '07:00', endTime: '19:00' },
      thursday: { available: true, startTime: '07:00', endTime: '19:00' },
      friday: { available: true, startTime: '07:00', endTime: '19:00' },
      saturday: { available: true, startTime: '09:00', endTime: '17:00' },
      sunday: { available: true, startTime: '09:00', endTime: '17:00' },
    },
    rating: 4.8,
    reviewCount: 63,
    completedShifts: 428,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    userId: 'c3',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@email.com',
    phone: '(555) 456-7890',
    certifications: ['HHA', 'CNA'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    specializations: ['pediatric', 'autism'],
    yearsExperience: 5,
    hourlyRate: 25,
    status: 'available',
    bio: 'Dedicated caregiver specializing in pediatric care and autism support. Fluent in Mandarin and Cantonese.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    backgroundCheckStatus: 'completed',
    backgroundCheckCompletedAt: '2024-03-01T00:00:00Z',
    backgroundCheckProvider: 'checkr',
    serviceArea: {
      zipCodes: ['94102', '94103', '94104', '94105'],
      radius: 12,
      city: 'San Francisco',
      state: 'CA',
    },
    availability: {
      monday: { available: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: true, startTime: '09:00', endTime: '17:00' },
      thursday: { available: true, startTime: '09:00', endTime: '17:00' },
      friday: { available: true, startTime: '09:00', endTime: '17:00' },
      saturday: { available: true, startTime: '10:00', endTime: '16:00' },
      sunday: { available: false },
    },
    rating: 4.7,
    reviewCount: 28,
    completedShifts: 156,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '4',
    userId: 'c4',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@email.com',
    phone: '(555) 567-8901',
    certifications: ['LPN', 'HHA'],
    languages: ['English'],
    specializations: ['hospice', 'mobility'],
    yearsExperience: 15,
    hourlyRate: 38,
    status: 'assigned',
    bio: 'Experienced LPN with 15 years in hospice and palliative care. Providing compassionate end-of-life support.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    backgroundCheckStatus: 'completed',
    backgroundCheckCompletedAt: '2024-01-20T00:00:00Z',
    backgroundCheckProvider: 'sterling',
    serviceArea: {
      zipCodes: '60601', '60602', '60603', '60604',
      radius: 20,
      city: 'Chicago',
      state: 'IL',
    },
    availability: {
      monday: { available: true, startTime: '08:00', endTime: '20:00' },
      tuesday: { available: true, startTime: '08:00', endTime: '20:00' },
      wednesday: { available: true, startTime: '08:00', endTime: '20:00' },
      thursday: { available: true, startTime: '08:00', endTime: '20:00' },
      friday: { available: true, startTime: '08:00', endTime: '20:00' },
      saturday: { available: true, startTime: '08:00', endTime: '20:00' },
      sunday: { available: true, startTime: '08:00', endTime: '20:00' },
    },
    rating: 5.0,
    reviewCount: 89,
    completedShifts: 623,
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '5',
    userId: 'c5',
    firstName: 'Amanda',
    lastName: 'Davis',
    email: 'amanda.davis@email.com',
    phone: '(555) 678-9012',
    certifications: ['CNA'],
    languages: ['English', 'Spanish'],
    specializations: ['diabetes', 'medication'],
    yearsExperience: 3,
    hourlyRate: 22,
    status: 'available',
    bio: 'CNA specializing in diabetes care and medication management. Bilingual in English and Spanish.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    backgroundCheckStatus: 'completed',
    backgroundCheckCompletedAt: '2024-04-01T00:00:00Z',
    backgroundCheckProvider: 'checkr',
    serviceArea: {
      zipCodes: ['77001', '77002', '77003', '77004'],
      radius: 18,
      city: 'Houston',
      state: 'TX',
    },
    availability: {
      monday: { available: true, startTime: '06:00', endTime: '14:00' },
      tuesday: { available: true, startTime: '06:00', endTime: '14:00' },
      wednesday: { available: true, startTime: '06:00', endTime: '14:00' },
      thursday: { available: true, startTime: '06:00', endTime: '14:00' },
      friday: { available: true, startTime: '06:00', endTime: '14:00' },
      saturday: { available: false },
      sunday: { available: false },
    },
    rating: 4.6,
    reviewCount: 19,
    completedShifts: 98,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  },
]

export function useCaregivers(filter?: CaregiverFilter, page = 1, perPage = 10) {
  return useQuery({
    queryKey: ['caregivers', filter, page, perPage],
    queryFn: async () => {
      // In production, this would call the actual API
      // return caregiverApi.search(filter, page, perPage)
      
      // Mock implementation
      let filtered = [...mockCaregivers]
      
      if (filter) {
        if (filter.certifications?.length) {
          filtered = filtered.filter(c => 
            filter.certifications!.some(cert => c.certifications.includes(cert))
          )
        }
        
        if (filter.languages?.length) {
          filtered = filtered.filter(c => 
            filter.languages!.some(lang => c.languages.includes(lang))
          )
        }
        
        if (filter.specializations?.length) {
          filtered = filtered.filter(c => 
            filter.specializations!.some(spec => c.specializations.includes(spec))
          )
        }
        
        if (filter.minRating) {
          filtered = filtered.filter(c => c.rating >= filter.minRating!)
        }
        
        if (filter.maxHourlyRate) {
          filtered = filtered.filter(c => c.hourlyRate <= filter.maxHourlyRate!)
        }
        
        if (filter.availableOnly) {
          filtered = filtered.filter(c => c.status === 'available')
        }
        
        if (filter.backgroundChecked) {
          filtered = filtered.filter(c => c.backgroundCheckStatus === 'completed')
        }
        
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase()
          filtered = filtered.filter(c => 
            c.firstName.toLowerCase().includes(query) ||
            c.lastName.toLowerCase().includes(query) ||
            c.bio?.toLowerCase().includes(query)
          )
        }
      }
      
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginatedData = filtered.slice(start, end)
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          page,
          perPage,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / perPage),
        },
      } as PaginatedResponse<CaregiverProfile>
    },
  })
}

export function useCaregiver(id: string) {
  return useQuery({
    queryKey: ['caregiver', id],
    queryFn: async () => {
      // In production: return caregiverApi.getById(id)
      const caregiver = mockCaregivers.find(c => c.id === id)
      if (!caregiver) throw new Error('Caregiver not found')
      return { success: true, data: caregiver } as ApiResponse<CaregiverProfile>
    },
    enabled: !!id,
  })
}

export function useUpdateCaregiver() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CaregiverProfile> }) => {
      // In production: return caregiverApi.update(id, data)
      return { success: true, data } as ApiResponse<CaregiverProfile>
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['caregiver', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['caregivers'] })
    },
  })
}
