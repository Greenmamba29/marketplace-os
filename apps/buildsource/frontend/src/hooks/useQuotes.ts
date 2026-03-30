import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotesService, CreateQuoteData, UpdateQuoteData } from '@services/quotes';
import { PaginationParams } from '@types/index';

const QUOTES_QUERY_KEY = 'quotes';

export const useQuotes = (
  filters?: { rfq_id?: string; supplier_id?: string; status?: string },
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, filters, pagination],
    queryFn: () => quotesService.getQuotes(filters, pagination),
    staleTime: 2 * 60 * 1000,
  });
};

export const useQuote = (id: string) => {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, id],
    queryFn: () => quotesService.getQuote(id),
    enabled: !!id,
  });
};

export const useCompareQuotes = (rfqId: string) => {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, 'compare', rfqId],
    queryFn: () => quotesService.compareQuotes(rfqId),
    enabled: !!rfqId,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quotesService.createQuote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['rfq', data.rfq_id, 'quotes'] });
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuoteData }) =>
      quotesService.updateQuote(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
    },
  });
};

export const useSubmitQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quotesService.submitQuote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY, data.id] });
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['rfq', data.rfq_id] });
    },
  });
};

export const useAcceptQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quotesService.acceptQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['rfq'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useRejectQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      quotesService.rejectQuote(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
    },
  });
};

export const useWithdrawQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      quotesService.withdrawQuote(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
    },
  });
};
