import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { equipmentApi, udiApi } from '../services/api'
import { Equipment, EquipmentFilters, PaginationParams } from '../types'

// Equipment Hooks
export const useEquipment = (id: string) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentApi.getById(id),
    enabled: !!id,
  })
}

export const useEquipmentList = (params?: PaginationParams & EquipmentFilters) => {
  return useQuery({
    queryKey: ['equipment', 'list', params],
    queryFn: () => equipmentApi.getAll(params),
  })
}

export const useEquipmentSearch = (query: string, filters?: EquipmentFilters) => {
  return useQuery({
    queryKey: ['equipment', 'search', query, filters],
    queryFn: () => equipmentApi.search(query, filters),
    enabled: query.length >= 2,
  })
}

export const useEquipmentByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['equipment', 'category', categoryId],
    queryFn: () => equipmentApi.getByCategory(categoryId),
    enabled: !!categoryId,
  })
}

export const useRegulatoryInfo = (id: string) => {
  return useQuery({
    queryKey: ['equipment', id, 'regulatory'],
    queryFn: () => equipmentApi.getRegulatoryInfo(id),
    enabled: !!id,
  })
}

export const useFDAVerification = (id: string) => {
  return useQuery({
    queryKey: ['equipment', id, 'fda-verify'],
    queryFn: () => equipmentApi.verifyFDA(id),
    enabled: !!id,
  })
}

// UDI Hooks
export const useUDIScan = (udi: string) => {
  return useQuery({
    queryKey: ['udi', 'scan', udi],
    queryFn: () => udiApi.scan(udi),
    enabled: udi.length >= 10,
  })
}

export const useUDIValidation = (udi: string) => {
  return useQuery({
    queryKey: ['udi', 'validate', udi],
    queryFn: () => udiApi.validate(udi),
    enabled: udi.length >= 10,
  })
}

export const useUDIHistory = (udi: string) => {
  return useQuery({
    queryKey: ['udi', 'history', udi],
    queryFn: () => udiApi.getHistory(udi),
    enabled: udi.length >= 10,
  })
}

export const useOrderUDIs = (orderId: string) => {
  return useQuery({
    queryKey: ['udi', 'order', orderId],
    queryFn: () => udiApi.getByOrder(orderId),
    enabled: !!orderId,
  })
}

export const useRecordUDIMovement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ udi, data }: { udi: string; data: { fromLocation: string; toLocation: string; reason: string } }) =>
      udiApi.recordMovement(udi, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['udi', 'history', variables.udi] })
      queryClient.invalidateQueries({ queryKey: ['udi', 'scan', variables.udi] })
    },
  })
}

// Equipment Mutations
export const useCreateEquipment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<Equipment>) =>
      fetch('/api/v1/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })
}

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Equipment> }) =>
      fetch(`/api/v1/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['equipment', 'list'] })
    },
  })
}
