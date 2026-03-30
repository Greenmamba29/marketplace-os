import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { RFQ, Quote, ApiResponse } from '@/types'
import { api } from '@/services/api'

const RFQS_KEY = 'rfqs'

export function useRFQs(status?: string) {
  return useQuery({
    queryKey: [RFQS_KEY, status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      const response = await api.get<ApiResponse<RFQ[]>>(`/rfqs${params}`)
      return response.data.data || []
    },
  })
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: [RFQS_KEY, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<RFQ>>(`/rfqs/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<RFQ>) => {
      const response = await api.post<ApiResponse<RFQ>>('/rfqs', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] })
    },
  })
}

export function useSubmitQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ rfqId, quote }: { rfqId: string; quote: Partial<Quote> }) => {
      const response = await api.post<ApiResponse<Quote>>(`/rfqs/${rfqId}/quotes`, quote)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY, variables.rfqId] })
    },
  })
}

export function useApproveRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ rfqId, step, comments }: { rfqId: string; step: number; comments?: string }) => {
      const response = await api.post<ApiResponse<RFQ>>(`/rfqs/${rfqId}/approve`, { step, comments })
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY, variables.rfqId] })
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] })
    },
  })
}

export function useRejectRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ rfqId, step, comments }: { rfqId: string; step: number; comments: string }) => {
      const response = await api.post<ApiResponse<RFQ>>(`/rfqs/${rfqId}/reject`, { step, comments })
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY, variables.rfqId] })
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] })
    },
  })
}

export function useAwardRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) => {
      const response = await api.post<ApiResponse<RFQ>>(`/rfqs/${rfqId}/award`, { quoteId })
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY, variables.rfqId] })
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] })
    },
  })
}
