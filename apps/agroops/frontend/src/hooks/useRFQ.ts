import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rfqApi } from '@/services/api'
import toast from 'react-hot-toast'

export const useRFQs = (params?: {
  page?: number
  per_page?: number
  status?: string
  my_rfqs?: boolean
}) => {
  return useQuery({
    queryKey: ['rfqs', params],
    queryFn: () => rfqApi.getAll(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
  })
}

export const useRFQ = (id: string) => {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: () => rfqApi.getById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateRFQ = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: (data: object) => rfqApi.create(data).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      toast.success('RFQ created successfully')
      navigate(`/rfq/${data.id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create RFQ')
    },
  })
}

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) =>
      rfqApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      toast.success('RFQ updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update RFQ')
    },
  })
}

export const usePublishRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => rfqApi.publish(id).then((res) => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', id] })
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      toast.success('RFQ published successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to publish RFQ')
    },
  })
}

export const useCancelRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => rfqApi.cancel(id).then((res) => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', id] })
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      toast.success('RFQ cancelled')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel RFQ')
    },
  })
}

export const useDeleteRFQ = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: (id: string) => rfqApi.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      toast.success('RFQ deleted')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete RFQ')
    },
  })
}

export const useRFQQuotes = (id: string) => {
  return useQuery({
    queryKey: ['rfq', id, 'quotes'],
    queryFn: () => rfqApi.getQuotes(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useAwardRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      rfqApi.award(rfqId, quoteId).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.rfqId] })
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      toast.success('Quote awarded successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to award quote')
    },
  })
}

// Import useNavigate at the top
import { useNavigate } from 'react-router-dom'
