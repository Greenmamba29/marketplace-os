import { api } from './api';
import { Order, PaginatedResponse, PaginationParams, OrderStatus } from '@types/index';

export interface CreateOrderData {
  quote_id: string;
  po_number?: string;
  notes?: string;
}

export interface UpdateOrderData {
  po_number?: string;
  notes?: string;
  delivery_date?: string;
  delivery_window?: string;
}

export const ordersService = {
  // Get all orders
  getOrders: async (
    filters?: {
      status?: OrderStatus;
      project_id?: string;
      supplier_id?: string;
    },
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.project_id) params.append('project_id', filters.project_id);
    if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.page_size.toString());
    }
    const response = await api.get<PaginatedResponse<Order>>(`/orders?${params.toString()}`);
    return response.data!;
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data!;
  },

  // Create order from quote
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data!;
  },

  // Update order
  updateOrder: async (id: string, data: UpdateOrderData): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}`, data);
    return response.data!;
  },

  // Cancel order
  cancelOrder: async (id: string, reason: string): Promise<void> => {
    await api.post(`/orders/${id}/cancel`, { reason });
  },

  // Get order tracking
  getTracking: async (id: string): Promise<{
    current_status: string;
    current_location?: string;
    estimated_arrival: string;
    status_updates: Array<{
      timestamp: string;
      status: string;
      location?: string;
      notes?: string;
    }>;
  }> => {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data!;
  },

  // Confirm delivery
  confirmDelivery: async (id: string, notes?: string): Promise<void> => {
    await api.post(`/orders/${id}/confirm-delivery`, { notes });
  },

  // Report issue with order
  reportIssue: async (id: string, issue: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<void> => {
    await api.post(`/orders/${id}/issues`, issue);
  },

  // Get order documents
  getDocuments: async (id: string): Promise<Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploaded_at: string;
  }>> => {
    const response = await api.get(`/orders/${id}/documents`);
    return response.data!;
  },

  // Upload order document
  uploadDocument: async (id: string, file: File, type: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    await api.post(`/orders/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get delivery schedule for a project
  getDeliverySchedule: async (projectId: string): Promise<Array<{
    order_id: string;
    order_number: string;
    delivery_date: string;
    delivery_window: string;
    materials: string[];
    supplier_name: string;
    status: string;
  }>> => {
    const response = await api.get(`/orders/schedule?project_id=${projectId}`);
    return response.data!;
  },
};
