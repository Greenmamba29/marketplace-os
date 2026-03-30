import { useQuery, useMutation, useQueryClient } from 'react-query'
import { rfqApi } from '../services/api'
import { RFQ } from '../types'
import toast from 'react-hot-toast'

const RFQ_QUERY_KEY = 'rfq'

export function useRFQs() {
  return useQuery(
    [RFQ_QUERY_KEY],
    () => rfqApi.list().then(res => res.data),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}

export function useRFQ(id: string) {
  return useQuery(
    [RFQ_QUERY_KEY, id],
    () => rfqApi.get(id).then(res => res.data),
    {
      enabled: !!id,
    }
  )
}

export function useCreateRFQ() {
  const queryClient = useQueryClient()
  
  return useMutation(
    (data: Record<string, unknown>) => rfqApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RFQ_QUERY_KEY])
        toast.success('RFQ created successfully')
      },
      onError: () => {
        toast.error('Failed to create RFQ')
      },
    }
  )
}

export function useUpdateRFQ() {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      rfqApi.update(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([RFQ_QUERY_KEY])
        queryClient.invalidateQueries([RFQ_QUERY_KEY, variables.id])
        toast.success('RFQ updated successfully')
      },
      onError: () => {
        toast.error('Failed to update RFQ')
      },
    }
  )
}

export function usePublishRFQ() {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id: string) => rfqApi.publish(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries([RFQ_QUERY_KEY])
        queryClient.invalidateQueries([RFQ_QUERY_KEY, id])
        toast.success('RFQ published successfully')
      },
      onError: () => {
        toast.error('Failed to publish RFQ')
      },
    }
  )
}

export function useCloseRFQ() {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id: string) => rfqApi.close(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries([RFQ_QUERY_KEY])
        queryClient.invalidateQueries([RFQ_QUERY_KEY, id])
        toast.success('RFQ closed successfully')
      },
      onError: () => {
        toast.error('Failed to close RFQ')
      },
    }
  )
}

export function useSubmitQuote() {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ rfqId, data }: { rfqId: string; data: Record<string, unknown> }) =>
      rfqApi.submitQuote(rfqId, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([RFQ_QUERY_KEY, variables.rfqId, 'quotes'])
        toast.success('Quote submitted successfully')
      },
      onError: () => {
        toast.error('Failed to submit quote')
      },
    }
  )
}

export function useQuotes(rfqId: string) {
  return useQuery(
    [RFQ_QUERY_KEY, rfqId, 'quotes'],
    () => rfqApi.getQuotes(rfqId).then(res => res.data),
    {
      enabled: !!rfqId,
    }
  )
}

export function useAcceptQuote() {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      rfqApi.acceptQuote(rfqId, quoteId),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([RFQ_QUERY_KEY])
        queryClient.invalidateQueries([RFQ_QUERY_KEY, variables.rfqId])
        toast.success('Quote accepted successfully')
      },
      onError: () => {
        toast.error('Failed to accept quote')
      },
    }
  )
}
