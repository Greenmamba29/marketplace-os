import { api } from './api';
import { AccioRequest } from '@types/index';

export interface CreateAccioRequestData {
  project_id: string;
  material_type: string;
  specification: string;
  quantity_needed: number;
  unit_of_measure: string;
  needed_by: string;
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact_phone: string;
  contact_name: string;
  urgency_reason: string;
  max_budget?: number;
}

export const accioService = {
  // Create emergency sourcing request
  createRequest: async (data: CreateAccioRequestData): Promise<AccioRequest> => {
    const response = await api.post<AccioRequest>('/accio/request', data);
    return response.data!;
  },

  // Get request status
  getRequest: async (requestId: string): Promise<AccioRequest> => {
    const response = await api.get<AccioRequest>(`/accio/request/${requestId}`);
    return response.data!;
  },

  // Get all requests for user
  getMyRequests: async (): Promise<AccioRequest[]> => {
    const response = await api.get<AccioRequest[]>('/accio/my-requests');
    return response.data!;
  },

  // Cancel request
  cancelRequest: async (requestId: string, reason: string): Promise<void> => {
    await api.post(`/accio/request/${requestId}/cancel`, { reason });
  },

  // Get estimated delivery for emergency request
  getEstimatedDelivery: async (data: {
    material_type: string;
    zip_code: string;
    quantity: number;
  }): Promise<{
    estimated_time_hours: number;
    estimated_cost_range: {
      min: number;
      max: number;
    };
    available_suppliers: number;
  }> {
    const response = await api.post('/accio/estimate', data);
    return response.data!;
  },

  // Get active emergency requests (admin only)
  getActiveRequests: async (): Promise<AccioRequest[]> => {
    const response = await api.get<AccioRequest[]>('/accio/active');
    return response.data!;
  },

  // Update request status (admin/supplier only)
  updateStatus: async (
    requestId: string,
    status: string,
    updates?: {
      matched_supplier_id?: string;
      estimated_arrival?: string;
      notes?: string;
    }
  ): Promise<AccioRequest> => {
    const response = await api.patch<AccioRequest>(`/accio/request/${requestId}/status`, {
      status,
      ...updates,
    });
    return response.data!;
  },
};
