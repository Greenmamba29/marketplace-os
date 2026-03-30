import { api } from './api';
import { 
  RFQSubmission, 
  RFQItem, 
  PaginatedResponse, 
  PaginationParams 
} from '@types/index';

export interface CreateRFQData {
  project_id: string;
  title: string;
  description?: string;
  items: Array<{
    material_type: string;
    specification: string;
    quantity: number;
    unit_of_measure: string;
    grade_requirement?: string;
    astm_requirement?: string;
    notes?: string;
  }>;
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  delivery_instructions?: string;
  delivery_date: string;
  acceptance_deadline: string;
  invited_suppliers?: string[];
}

export interface UpdateRFQData {
  title?: string;
  description?: string;
  delivery_date?: string;
  acceptance_deadline?: string;
  status?: string;
}

export const rfqService = {
  // Get all RFQs
  getRFQs: async (
    filters?: {
      status?: string;
      project_id?: string;
    },
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<RFQSubmission>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.project_id) params.append('project_id', filters.project_id);
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.page_size.toString());
    }
    const response = await api.get<PaginatedResponse<RFQSubmission>>(`/rfq?${params.toString()}`);
    return response.data!;
  },

  // Get single RFQ
  getRFQ: async (id: string): Promise<RFQSubmission> => {
    const response = await api.get<RFQSubmission>(`/rfq/${id}`);
    return response.data!;
  },

  // Create new RFQ
  createRFQ: async (data: CreateRFQData): Promise<RFQSubmission> => {
    const response = await api.post<RFQSubmission>('/rfq', data);
    return response.data!;
  },

  // Update RFQ
  updateRFQ: async (id: string, data: UpdateRFQData): Promise<RFQSubmission> => {
    const response = await api.patch<RFQSubmission>(`/rfq/${id}`, data);
    return response.data!;
  },

  // Cancel RFQ
  cancelRFQ: async (id: string, reason: string): Promise<void> => {
    await api.post(`/rfq/${id}/cancel`, { reason });
  },

  // Award RFQ to supplier
  awardRFQ: async (rfqId: string, quoteId: string): Promise<void> => {
    await api.post(`/rfq/${rfqId}/award`, { quote_id: quoteId });
  },

  // Get RFQ quotes
  getRFQQuotes: async (rfqId: string): Promise<any[]> => {
    const response = await api.get<any[]>(`/rfq/${rfqId}/quotes`);
    return response.data!;
  },

  // Get recommended suppliers for RFQ
  getRecommendedSuppliers: async (
    rfqId: string
  ): Promise<Array<{
    supplier_id: string;
    supplier_name: string;
    match_score: number;
    distance_miles: number;
    estimated_price: number;
  }>> => {
    const response = await api.get(`/rfq/${rfqId}/recommended-suppliers`);
    return response.data!;
  },

  // Extend RFQ deadline
  extendDeadline: async (rfqId: string, newDeadline: string): Promise<RFQSubmission> => {
    const response = await api.post<RFQSubmission>(`/rfq/${rfqId}/extend`, {
      new_deadline: newDeadline,
    });
    return response.data!;
  },

  // Clone RFQ
  cloneRFQ: async (rfqId: string, modifications?: Partial<CreateRFQData>): Promise<RFQSubmission> => {
    const response = await api.post<RFQSubmission>(`/rfq/${rfqId}/clone`, modifications || {});
    return response.data!;
  },
};
