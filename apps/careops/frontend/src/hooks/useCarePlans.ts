import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CarePlan, ApiResponse, PaginatedResponse } from '../types'

// Mock data
const mockCarePlans: CarePlan[] = [
  {
    id: '1',
    familyId: 'f1',
    patientName: 'Eleanor Thompson',
    patientAge: 78,
    careType: 'personal_care',
    status: 'active',
    address: {
      street: '123 Maple Street',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
    },
    scheduleRequirements: {
      startDate: '2024-01-15',
      durationWeeks: 12,
      ongoing: false,
      preferredDays: ['monday', 'wednesday', 'friday'],
      preferredStartTime: '09:00',
      preferredEndTime: '15:00',
      flexibility: 'moderate',
    },
    careNeeds: {
      mobilityAssistance: true,
      medicationReminders: true,
      mealPreparation: true,
      lightHousekeeping: true,
      bathingDressing: true,
      toiletingIncontinence: false,
      transportation: true,
      specializedCare: ['dementia'],
      additionalNotes: 'Patient has early-stage dementia. Prefers familiar faces and routine.',
    },
    emergencyContact: {
      name: 'Michael Thompson',
      relationship: 'Son',
      phone: '(555) 987-6543',
      alternatePhone: '(555) 876-5432',
    },
    assignedCaregiverId: '1',
    hourlyBudget: 30,
    estimatedHoursPerWeek: 18,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    familyId: 'f1',
    patientName: 'Robert Martinez',
    patientAge: 65,
    careType: 'post_surgical',
    status: 'matched',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
    },
    scheduleRequirements: {
      startDate: '2024-02-01',
      durationWeeks: 4,
      ongoing: false,
      preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      preferredStartTime: '08:00',
      preferredEndTime: '16:00',
      flexibility: 'strict',
    },
    careNeeds: {
      mobilityAssistance: true,
      medicationReminders: true,
      mealPreparation: true,
      lightHousekeeping: true,
      bathingDressing: true,
      toiletingIncontinence: true,
      transportation: false,
      specializedCare: ['post-surgical'],
      additionalNotes: 'Recovering from hip replacement surgery. Needs assistance with mobility.',
    },
    emergencyContact: {
      name: 'Maria Martinez',
      relationship: 'Wife',
      phone: '(555) 765-4321',
    },
    hourlyBudget: 40,
    estimatedHoursPerWeek: 40,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    familyId: 'f2',
    patientName: 'Sophie Williams',
    patientAge: 8,
    careType: 'companionship',
    status: 'draft',
    address: {
      street: '789 Pine Road',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
    },
    scheduleRequirements: {
      startDate: '2024-03-01',
      ongoing: true,
      preferredDays: ['saturday', 'sunday'],
      preferredStartTime: '10:00',
      preferredEndTime: '16:00',
      flexibility: 'flexible',
    },
    careNeeds: {
      mobilityAssistance: false,
      medicationReminders: false,
      mealPreparation: true,
      lightHousekeeping: false,
      bathingDressing: false,
      toiletingIncontinence: false,
      transportation: true,
      specializedCare: ['autism'],
      additionalNotes: 'Child with autism needs weekend companion care. Experience with special needs preferred.',
    },
    emergencyContact: {
      name: 'David Williams',
      relationship: 'Father',
      phone: '(555) 654-3210',
      alternatePhone: '(555) 543-2109',
    },
    hourlyBudget: 25,
    estimatedHoursPerWeek: 12,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
]

export function useCarePlans(familyId?: string) {
  return useQuery({
    queryKey: ['carePlans', familyId],
    queryFn: async () => {
      // In production: return carePlanApi.list(familyId)
      let filtered = [...mockCarePlans]
      if (familyId) {
        filtered = filtered.filter(cp => cp.familyId === familyId)
      }
      
      return {
        success: true,
        data: filtered,
        pagination: {
          page: 1,
          perPage: filtered.length,
          total: filtered.length,
          totalPages: 1,
        },
      } as PaginatedResponse<CarePlan>
    },
  })
}

export function useCarePlan(id: string) {
  return useQuery({
    queryKey: ['carePlan', id],
    queryFn: async () => {
      // In production: return carePlanApi.getById(id)
      const carePlan = mockCarePlans.find(cp => cp.id === id)
      if (!carePlan) throw new Error('Care plan not found')
      return { success: true, data: carePlan } as ApiResponse<CarePlan>
    },
    enabled: !!id,
  })
}

export function useCreateCarePlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<CarePlan, 'id' | 'createdAt' | 'updatedAt'>) => {
      // In production: return carePlanApi.create(data)
      const newCarePlan: CarePlan = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockCarePlans.push(newCarePlan)
      return { success: true, data: newCarePlan } as ApiResponse<CarePlan>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carePlans'] })
    },
  })
}

export function useUpdateCarePlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CarePlan> }) => {
      // In production: return carePlanApi.update(id, data)
      const index = mockCarePlans.findIndex(cp => cp.id === id)
      if (index === -1) throw new Error('Care plan not found')
      
      mockCarePlans[index] = {
        ...mockCarePlans[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return { success: true, data: mockCarePlans[index] } as ApiResponse<CarePlan>
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carePlan', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['carePlans'] })
    },
  })
}

export function useAssignCaregiver() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ carePlanId, caregiverId }: { carePlanId: string; caregiverId: string }) => {
      // In production: return carePlanApi.assignCaregiver(carePlanId, caregiverId)
      const index = mockCarePlans.findIndex(cp => cp.id === carePlanId)
      if (index === -1) throw new Error('Care plan not found')
      
      mockCarePlans[index] = {
        ...mockCarePlans[index],
        assignedCaregiverId: caregiverId,
        status: 'active',
        updatedAt: new Date().toISOString(),
      }
      return { success: true, data: mockCarePlans[index] } as ApiResponse<CarePlan>
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carePlan', variables.carePlanId] })
      queryClient.invalidateQueries({ queryKey: ['carePlans'] })
    },
  })
}
