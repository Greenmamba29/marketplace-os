import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqService, CreateRFQData, UpdateRFQData } from '@services/rfq';
import { PaginationParams } from '@types/index';

const RFQ_QUERY_KEY = 'rfq';

export const useRFQs = (filters?: { status?: string; project_id?: string }, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [RFQ_QUERY_KEY, filters, pagination],
    queryFn: () => rfqService.getRFQs(filters, pagination),
    staleTime: 2 * 60 * 1000,
  });
};

export const useRFQ = (id: string) => {
  return useQuery({
    queryKey: [RFQ_QUERY_KEY, id],
    queryFn: () => rfqService.getRFQ(id),
    enabled: !!id,
  });
};

export const useRFQQuotes = (rfqId: string) => {
  return useQuery({
    queryKey: [RFQ_QUERY_KEY, rfqId, 'quotes'],
    queryFn: () => rfqService.getRFQQuotes(rfqId),
    enabled: !!rfqId,
  });
};

export const useRecommendedSuppliers = (rfqId: string) => {
  return useQuery({
    queryKey: [RFQ_QUERY_KEY, rfqId, 'recommended-suppliers'],
    queryFn: () => rfqService.getRecommendedSuppliers(rfqId),
    enabled: !!rfqId,
  });
};

export const useCreateRFQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rfqService.createRFQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY] });
    },
  });
};

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRFQData }) =>
      rfqService.updateRFQ(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY] });
    },
  });
};

export const useCancelRFQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rfqService.cancelRFQ(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY] });
    },
  });
};

export const useAwardRFQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      rfqService.awardRFQ(rfqId, quoteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY, variables.rfqId] });
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
};

export const useExtendRFQDeadline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ rfqId, newDeadline }: { rfqId: string; newDeadline: string }) =>
      rfqService.extendDeadline(rfqId, newDeadline),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY, variables.rfqId] });
    },
  });
};

export const useCloneRFQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ rfqId, modifications }: { rfqId: string; modifications?: Partial<CreateRFQData> }) =>
      rfqService.cloneRFQ(rfqId, modifications),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFQ_QUERY_KEY] });
    },
  });
};
