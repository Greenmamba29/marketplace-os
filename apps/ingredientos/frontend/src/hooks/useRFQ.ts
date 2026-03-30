import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rfqApi, quoteApi } from '../services/api'
import type { RFQSubmission, Quote, PaginatedResponse } from '../types'

// Query Keys
export const rfqKeys = {
  all: ['rfq'] as const,
  lists: () => [...rfqKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...rfqKeys.lists(), filters] as const,
  details: () => [...rfqKeys.all, 'detail'] as const,
  detail: (id: string) => [...rfqKeys.details(), id] as const,
  quotes: (rfqId: string) => [...rfqKeys.detail(rfqId), 'quotes'] as const,
}

// Hooks
export const useRFQs = (filters?: { status?: string; page?: number; per_page?: number }) => {
  return useQuery<PaginatedResponse<RFQSubmission>>({
    queryKey: rfqKeys.list(filters || {}),
    queryFn: () => rfqApi.getAll(filters),
  })
}

export const useRFQ = (id: string) => {
  return useQuery<RFQSubmission>({
    queryKey: rfqKeys.detail(id),
    queryFn: () => rfqApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: unknown) => rfqApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.lists() })
    },
  })
}

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => rfqApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: rfqKeys.lists() })
    },
  })
}

export const useCancelRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => rfqApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.lists() })
    },
  })
}

export const useRFQQuotes = (rfqId: string) => {
  return useQuery<Quote[]>({
    queryKey: rfqKeys.quotes(rfqId),
    queryFn: () => rfqApi.getQuotes(rfqId),
    enabled: !!rfqId,
  })
}

export const useSubmitQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ rfqId, data }: { rfqId: string; data: unknown }) =>
      quoteApi.submit(rfqId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.quotes(variables.rfqId) })
    },
  })
}

export const useSelectQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      rfqApi.selectQuote(rfqId, quoteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(variables.rfqId) })
      queryClient.invalidateQueries({ queryKey: rfqKeys.quotes(variables.rfqId) })
    },
  })
}
