import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../services/api'
import { Order, OrderStatus } from '../types'

// Order Hooks
export const useOrderList = (params?: { page?: number; perPage?: number; status?: OrderStatus }) => {
  return useQuery({
    queryKey: ['orders', 'list', params],
    queryFn: () => orderApi.getAll(params),
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  })
}

export const useOrderTracking = (id: string) => {
  return useQuery({
    queryKey: ['orders', id, 'tracking'],
    queryFn: () => orderApi.getTracking(id),
    enabled: !!id,
  })
}

export const useOrderCompliance = (id: string) => {
  return useQuery({
    queryKey: ['orders', id, 'compliance'],
    queryFn: () => orderApi.getCompliance(id),
    enabled: !!id,
  })
}

// Order Mutations
export const useCreateOrderFromQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ quoteId, data }: { quoteId: string; data?: unknown }) =>
      orderApi.createFromQuote(quoteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status, data }: { id: string; status: OrderStatus; data?: unknown }) =>
      orderApi.updateStatus(id, status, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'list'] })
    },
  })
}

export const useReceiveOrderItems = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: unknown[] }) =>
      orderApi.receiveItems(id, items),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id, 'compliance'] })
    },
  })
}
