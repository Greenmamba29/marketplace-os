import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService, CreateOrderData, UpdateOrderData } from '@services/orders';
import { OrderStatus, PaginationParams } from '@types/index';

const ORDERS_QUERY_KEY = 'orders';

export const useOrders = (
  filters?: { status?: OrderStatus; project_id?: string; supplier_id?: string },
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, filters, pagination],
    queryFn: () => ordersService.getOrders(filters, pagination),
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
  });
};

export const useOrderTracking = (id: string) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id, 'tracking'],
    queryFn: () => ordersService.getTracking(id),
    enabled: !!id,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useOrderDocuments = (id: string) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id, 'documents'],
    queryFn: () => ordersService.getDocuments(id),
    enabled: !!id,
  });
};

export const useDeliverySchedule = (projectId: string) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, 'schedule', projectId],
    queryFn: () => ordersService.getDeliverySchedule(projectId),
    enabled: !!projectId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['quotes', data.quote_id] });
      queryClient.invalidateQueries({ queryKey: ['rfq'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderData }) =>
      ordersService.updateOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ordersService.cancelOrder(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
};

export const useConfirmDelivery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      ordersService.confirmDelivery(id, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
};

export const useReportIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      issue,
    }: {
      id: string;
      issue: { type: string; description: string; severity: 'low' | 'medium' | 'high' | 'critical' };
    }) => ordersService.reportIssue(id, issue),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, variables.id] });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, file, type }: { id: string; file: File; type: string }) =>
      ordersService.uploadDocument(id, file, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, variables.id, 'documents'] });
    },
  });
};
