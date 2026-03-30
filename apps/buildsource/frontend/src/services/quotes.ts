import { api } from './api';
import { Quote, PaginatedResponse, PaginationParams } from '@types/index';

export interface CreateQuoteData {
  rfq_id: string;
  items: Array<{
    rfq_item_id: string;
    material_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    availability_date: string;
  }>;
  delivery_fee: number;
  delivery_date: string;
  payment_terms: string;
  validity_days: number;
  notes?: string;
}

export interface UpdateQuoteData {
  items?: Array<{
    id?: string;
    rfq_item_id: string;
    material_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    availability_date: string;
  }>;
  delivery_fee?: number;
  delivery_date?: string;
  payment_terms?: string;
  validity_days?: number;
  notes?: string;
}

export const quotesService = {
  // Get all quotes
  getQuotes: async (
    filters?: {
      rfq_id?: string;
      supplier_id?: string;
      status?: string;
    },
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Quote>> => {
    const params = new URLSearchParams();
    if (filters?.rfq_id) params.append('rfq_id', filters.rfq_id);
    if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);
    if (filters?.status) params.append('status', filters.status);
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.page_size.toString());
    }
    const response = await api.get<PaginatedResponse<Quote>>(`/quotes?${params.toString()}`);
    return response.data!;
  },

  // Get single quote
  getQuote: async (id: string): Promise<Quote> => {
    const response = await api.get<Quote>(`/quotes/${id}`);
    return response.data!;
  },

  // Create new quote (supplier only)
  createQuote: async (data: CreateQuoteData): Promise<Quote> => {
    const response = await api.post<Quote>('/quotes', data);
    return response.data!;
  },

  // Update quote (supplier only, before submission)
  updateQuote: async (id: string, data: UpdateQuoteData): Promise<Quote> => {
    const response = await api.patch<Quote>(`/quotes/${id}`, data);
    return response.data!;
  },

  // Submit quote
  submitQuote: async (id: string): Promise<Quote> => {
    const response = await api.post<Quote>(`/quotes/${id}/submit`, {});
    return response.data!;
  },

  // Accept quote (buyer only)
  acceptQuote: async (id: string): Promise<void> => {
    await api.post(`/quotes/${id}/accept`, {});
  },

  // Reject quote (buyer only)
  rejectQuote: async (id: string, reason: string): Promise<void> => {
    await api.post(`/quotes/${id}/reject`, { reason });
  },

  // Withdraw quote (supplier only)
  withdrawQuote: async (id: string, reason: string): Promise<void> => {
    await api.post(`/quotes/${id}/withdraw`, { reason });
  },

  // Compare quotes for an RFQ
  compareQuotes: async (rfqId: string): Promise<{
    quotes: Quote[];
    comparison_matrix: Array<{
      item_description: string;
      prices: Record<string, number>;
    }>;
    savings_analysis: {
      lowest_total: number;
      highest_total: number;
      potential_savings: number;
    };
  }> => {
    const response = await api.get(`/quotes/compare?rfq_id=${rfqId}`);
    return response.data!;
  },
};
