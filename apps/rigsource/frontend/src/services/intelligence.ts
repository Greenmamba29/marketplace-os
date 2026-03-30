import axios from 'axios';
import type { ACCIORequest, ComplianceReport, MarketIntelligence } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ACCIO Work - Autonomous Sourcing
export const accioApi = {
  // Submit natural language sourcing request
  submitRequest: async (description: string, requirements: string[]): Promise<ACCIORequest> => {
    const response = await apiClient.post('/accio/request', {
      description,
      requirements,
    });
    return response.data;
  },

  // Get request status
  getStatus: async (requestId: string): Promise<ACCIORequest> => {
    const response = await apiClient.get(`/accio/request/${requestId}`);
    return response.data;
  },

  // Get all requests for user
  getUserRequests: async (): Promise<ACCIORequest[]> => {
    const response = await apiClient.get('/accio/requests');
    return response.data;
  },

  // Cancel request
  cancelRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/accio/request/${requestId}/cancel`);
  },
};

// AI Compliance Reports
export const aiComplianceApi = {
  // Generate AI compliance report
  generateReport: async (casNumber: string, reportType: 'full_assessment' | 'reach_summary' | 'tsca_check' | 'safety_review' = 'full_assessment'): Promise<ComplianceReport> => {
    const response = await apiClient.post('/compliance/ai-report', {
      cas_number: casNumber,
      report_type: reportType,
    });
    return response.data;
  },

  // Get report generation status
  getReportStatus: async (reportId: string): Promise<{ status: 'pending' | 'generating' | 'completed' | 'failed'; report?: ComplianceReport }> => {
    const response = await apiClient.get(`/compliance/ai-report/${reportId}/status`);
    return response.data;
  },

  // Analyze compliance risk
  analyzeRisk: async (casNumber: string): Promise<{
    risk_level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  }> {
    const response = await apiClient.post('/compliance/analyze-risk', {
      cas_number: casNumber,
    });
    return response.data;
  },

  // Compare compliance across regions
  compareRegions: async (casNumber: string): Promise<{
    regions: {
      region: string;
      status: 'approved' | 'restricted' | 'banned' | 'under_review';
      notes: string;
    }[];
  }> {
    const response = await apiClient.get(`/compliance/compare-regions/${casNumber}`);
    return response.data;
  },
};

// Market Intelligence AI
export const aiIntelligenceApi = {
  // Generate market forecast
  generateForecast: async (casNumber: string, months = 6): Promise<{
    forecast: {
      month: string;
      predicted_price: number;
      confidence_interval: [number, number];
    }[];
    factors: string[];
  }> {
    const response = await apiClient.post('/intelligence/forecast', {
      cas_number: casNumber,
      months,
    });
    return response.data;
  },

  // Analyze supply chain risks
  analyzeSupplyChain: async (casNumber: string): Promise<{
    risk_score: number;
    risk_level: 'low' | 'medium' | 'high';
    factors: {
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      severity: 'low' | 'medium' | 'high';
    }[];
    recommendations: string[];
  }> {
    const response = await apiClient.get(`/intelligence/supply-chain/${casNumber}`);
    return response.data;
  },

  // Get alternative chemicals
  getAlternatives: async (casNumber: string, useCase?: string): Promise<{
    alternatives: {
      cas_number: string;
      name: string;
      similarity_score: number;
      pros: string[];
      cons: string[];
    }[];
  }> {
    const response = await apiClient.post('/intelligence/alternatives', {
      cas_number: casNumber,
      use_case: useCase,
    });
    return response.data;
  },

  // Summarize market news
  summarizeNews: async (casNumber: string): Promise<{
    summary: string;
    key_points: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    sources: string[];
  }> {
    const response = await apiClient.get(`/intelligence/news-summary/${casNumber}`);
    return response.data;
  },
};

// Live Price Index
export const priceIndexApi = {
  // Get current price index for chemical
  getCurrentPrice: async (casNumber: string): Promise<{
    cas_number: string;
    chemical_name: string;
    current_price_usd_kg: number;
    price_change_24h: number;
    price_change_7d: number;
    price_change_30d: number;
    last_updated: string;
  }> {
    const response = await apiClient.get(`/price-index/current/${casNumber}`);
    return response.data;
  },

  // Get price history
  getPriceHistory: async (casNumber: string, period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{
    data: {
      timestamp: string;
      price: number;
      volume?: number;
    }[];
  }> {
    const response = await apiClient.get(`/price-index/history/${casNumber}`, {
      params: { period },
    });
    return response.data;
  },

  // Get top movers
  getTopMovers: async (direction: 'gainers' | 'losers' = 'gainers', limit = 10): Promise<{
    chemicals: {
      cas_number: string;
      name: string;
      price_change_percent: number;
      current_price: number;
    }[];
  }> {
    const response = await apiClient.get('/price-index/top-movers', {
      params: { direction, limit },
    });
    return response.data;
  },

  // Get market overview
  getMarketOverview: async (): Promise<{
    total_chemicals_tracked: number;
    avg_price_change_24h: number;
    total_volume_24h: number;
    active_rfqs: number;
    market_sentiment: 'bullish' | 'bearish' | 'neutral';
  }> {
    const response = await apiClient.get('/price-index/overview');
    return response.data;
  },

  // Subscribe to price alerts
  subscribeToAlerts: async (casNumber: string, threshold: number, direction: 'above' | 'below'): Promise<void> => {
    await apiClient.post('/price-index/alerts/subscribe', {
      cas_number: casNumber,
      threshold,
      direction,
    });
  },

  // Unsubscribe from price alerts
  unsubscribeFromAlerts: async (casNumber: string): Promise<void> => {
    await apiClient.delete(`/price-index/alerts/${casNumber}`);
  },
};

// CAS Number Lookup
export const casLookupApi = {
  // Validate CAS number format
  validate: async (casNumber: string): Promise<{
    valid: boolean;
    normalized: string;
    checksum_valid: boolean;
  }> {
    const response = await apiClient.get('/cas/validate', {
      params: { cas: casNumber },
    });
    return response.data;
  },

  // Lookup CAS number details
  lookup: async (casNumber: string): Promise<{
    cas_number: string;
    name: string;
    synonyms: string[];
    molecular_formula: string;
    molecular_weight: number;
    category: string;
    found: boolean;
  }> {
    const response = await apiClient.get(`/cas/lookup/${casNumber}`);
    return response.data;
  },

  // Bulk lookup
  bulkLookup: async (casNumbers: string[]): Promise<{
    results: {
      cas_number: string;
      found: boolean;
      name?: string;
      category?: string;
    }[];
  }> {
    const response = await apiClient.post('/cas/bulk-lookup', {
      cas_numbers: casNumbers,
    });
    return response.data;
  },

  // Search by name to find CAS
  searchByName: async (name: string, limit = 10): Promise<{
    results: {
      cas_number: string;
      name: string;
      score: number;
    }[];
  }> {
    const response = await apiClient.get('/cas/search', {
      params: { name, limit },
    });
    return response.data;
  },

  // Get related CAS numbers (similar chemicals)
  getRelated: async (casNumber: string, limit = 10): Promise<{
    related: {
      cas_number: string;
      name: string;
      relationship: string;
    }[];
  }> {
    const response = await apiClient.get(`/cas/related/${casNumber}`);
    return response.data;
  },
};

export default apiClient;
