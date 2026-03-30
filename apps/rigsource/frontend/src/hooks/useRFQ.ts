import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi, quotesApi } from '@/services/baserow';
import type { RFQSubmission, Quote, RFQItem } from '@/types';

// Query keys
const RFQS_KEY = 'rfqs';
const RFQ_KEY = 'rfq';
const QUOTES_KEY = 'quotes';

// Get all RFQs for user
export function useRFQs(buyerId?: string) {
  return useQuery({
    queryKey: [RFQS_KEY, buyerId],
    queryFn: () => rfqApi.getAll(buyerId),
    staleTime: 2 * 60 * 1000,
  });
}

// Get single RFQ
export function useRFQ(id: string) {
  return useQuery({
    queryKey: [RFQ_KEY, id],
    queryFn: () => rfqApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// Get quotes for RFQ
export function useQuotesByRFQ(rfqId: string) {
  return useQuery({
    queryKey: [QUOTES_KEY, rfqId],
    queryFn: () => quotesApi.getByRFQ(rfqId),
    enabled: !!rfqId,
    staleTime: 2 * 60 * 1000,
  });
}

// Create RFQ
export function useCreateRFQ() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<RFQSubmission>) => rfqApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] });
    },
  });
}

// Update RFQ
export function useUpdateRFQ() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RFQSubmission> }) =>
      rfqApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQ_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] });
    },
  });
}

// Accept quote
export function useAcceptQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (quoteId: string) =>
      quotesApi.update(quoteId, { status: 'accepted' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });
      queryClient.invalidateQueries({ queryKey: [RFQS_KEY] });
    },
  });
}

// Reject quote
export function useRejectQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (quoteId: string) =>
      quotesApi.update(quoteId, { status: 'rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });
    },
  });
}
