import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accioService, CreateAccioRequestData } from '@services/accio';

const ACCIO_QUERY_KEY = 'accio';

export const useAccioRequest = (requestId: string) => {
  return useQuery({
    queryKey: [ACCIO_QUERY_KEY, 'request', requestId],
    queryFn: () => accioService.getRequest(requestId),
    enabled: !!requestId,
    refetchInterval: 60000, // Refetch every minute for active requests
  });
};

export const useMyAccioRequests = () => {
  return useQuery({
    queryKey: [ACCIO_QUERY_KEY, 'my-requests'],
    queryFn: accioService.getMyRequests,
    staleTime: 2 * 60 * 1000,
  });
};

export const useActiveAccioRequests = () => {
  return useQuery({
    queryKey: [ACCIO_QUERY_KEY, 'active'],
    queryFn: accioService.getActiveRequests,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAccioEstimate = () => {
  return useMutation({
    mutationFn: accioService.getEstimatedDelivery,
  });
};

export const useCreateAccioRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accioService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCIO_QUERY_KEY, 'my-requests'] });
    },
  });
};

export const useCancelAccioRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) =>
      accioService.cancelRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCIO_QUERY_KEY] });
    },
  });
};

export const useUpdateAccioStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      requestId,
      status,
      updates,
    }: {
      requestId: string;
      status: string;
      updates?: {
        matched_supplier_id?: string;
        estimated_arrival?: string;
        notes?: string;
      };
    }) => accioService.updateStatus(requestId, status, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ACCIO_QUERY_KEY, 'request', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: [ACCIO_QUERY_KEY, 'active'] });
    },
  });
};
