import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rfqApi, quoteApi } from '../services/api'
import { RFQ, RFQStatus, Quote } from '../types'

// RFQ Hooks
export const useRFQList = (params?: { page?: number; perPage?: number; status?: RFQStatus }) => {
  return useQuery({
    queryKey: ['rfq', 'list', params],
    queryFn: () => rfqApi.getAll(params),
  })
}

export const useRFQ = (id: string) => {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: () => rfqApi.getById(id),
    enabled: !!id,
  })
}

export const useRFQQuotes = (rfqId: string) => {
  return useQuery({
    queryKey: ['rfq', rfqId, 'quotes'],
    queryFn: () => rfqApi.getQuotes(rfqId),
    enabled: !!rfqId,
  })
}

// RFQ Mutations
export const useCreateRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<RFQ>) => rfqApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfq', 'list'] })
    },
  })
}

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RFQ> }) =>
      rfqApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfq', 'list'] })
    },
  })
}

export const useSubmitRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => rfqApi.submit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', id] })
      queryClient.invalidateQueries({ queryKey: ['rfq', 'list'] })
    },
  })
}

export const useApproveClinicalRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, approverId, comments }: { id: string; approverId: string; comments?: string }) =>
      rfqApi.approveClinical(id, { approverId, comments }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfq', 'list'] })
    },
  })
}

export const useApproveBudgetRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, approverId, approvedAmount, comments }: { 
      id: string; 
      approverId: string; 
      approvedAmount: number;
      comments?: string 
    }) => rfqApi.approveBudget(id, { approverId, approvedAmount, comments }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfq', 'list'] })
    },
  })
}

export const useCancelRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rfqApi.cancel(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfq', 'list'] })
    },
  })
}

export const useSelectQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      rfqApi.selectQuote(rfqId, quoteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.rfqId] })
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.rfqId, 'quotes'] })
    },
  })
}

// Quote Mutations
export const useSubmitQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ rfqId, data }: { rfqId: string; data: Partial<Quote> }) =>
      quoteApi.submit(rfqId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.rfqId, 'quotes'] })
    },
  })
}

export const useAcceptQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => quoteApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfq'] })
    },
  })
}

export const useRejectQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      quoteApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfq'] })
    },
  })
}
