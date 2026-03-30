import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi, quotesApi } from '@/services/api';
import type { RFQ, Quote, RFQStatus } from '@/types';

const RFQ_KEY = 'rfq';
const QUOTES_KEY = 'quotes';

export function useRFQs(
  filters?: { status?: RFQStatus; material_form?: string },
  page = 1,
  perPage = 20
) {
  return useQuery({
    queryKey: [RFQ_KEY, filters, page, perPage],
    queryFn: () =>
      rfqApi.getAll({
        ...filters,
        page,
        per_page: perPage,
      }),
    staleTime: 60 * 1000,
  });
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: [RFQ_KEY, id],
    queryFn: () => rfqApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRFQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RFQ>) => rfqApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFQ_KEY] });
    },
  });
}

export function useCancelRFQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rfqApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [RFQ_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [RFQ_KEY] });
    },
  });
}

export function useRFQQuotes(rfqId: string) {
  return useQuery({
    queryKey: [RFQ_KEY, rfqId, QUOTES_KEY],
    queryFn: () => rfqApi.getQuotes(rfqId),
    enabled: !!rfqId,
    staleTime: 60 * 1000,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Quote>) => quotesApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [RFQ_KEY, variables.rfq_id, QUOTES_KEY],
      });
    },
  });
}

export function useAcceptQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quotesApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });
      queryClient.invalidateQueries({ queryKey: [RFQ_KEY] });
    },
  });
}

export function useRejectQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      quotesApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });
      queryClient.invalidateQueries({ queryKey: [RFQ_KEY] });
    },
  });
}
