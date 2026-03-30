import axios from 'axios';
import type { 
  Chemical, 
  Supplier, 
  ProductOffering, 
  RFQSubmission, 
  Quote, 
  Order,
  ComplianceRecord,
  MarketIntelligence,
  RegulatoryAlert,
  ComplianceReport,
  SearchFilters 
} from '@/types';

const BASEROW_API_URL = import.meta.env.VITE_BASEROW_API_URL || 'https://api.baserow.io';
const BASEROW_TOKEN = import.meta.env.VITE_BASEROW_TOKEN;

const baserowClient = axios.create({
  baseURL: BASEROW_API_URL,
  headers: {
    'Authorization': `Token ${BASEROW_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Table IDs - these would be configured per environment
const TABLES = {
  CHEMICALS: 100001,
  SUPPLIERS: 100002,
  PRODUCT_OFFERINGS: 100003,
  RFQ_SUBMISSIONS: 100004,
  RFQ_ITEMS: 100005,
  QUOTES: 100006,
  QUOTE_ITEMS: 100007,
  ORDERS: 100008,
  COMPLIANCE_REGISTRY: 100009,
  MARKET_INTELLIGENCE: 100010,
  REGULATORY_ALERTS: 100011,
  COMPLIANCE_REPORTS: 100012,
  USERS: 100013,
};

// Chemicals
export const chemicalsApi = {
  getAll: async (filters?: SearchFilters, page = 1, size = 20): Promise<{ results: Chemical[]; total: number }> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    if (filters?.query) {
      params.append('search', filters.query);
    }
    if (filters?.category) {
      params.append('filter__category__equal', filters.category);
    }
    if (filters?.grade) {
      params.append('filter__grade__equal', filters.grade);
    }
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.CHEMICALS}/?${params.toString()}`);
    return {
      results: response.data.results.map(mapChemicalFromBaserow),
      total: response.data.count,
    };
  },

  getById: async (id: string): Promise<Chemical> => {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLES.CHEMICALS}/${id}/?user_field_names=true`
    );
    return mapChemicalFromBaserow(response.data);
  },

  getByCAS: async (casNumber: string): Promise<Chemical | null> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__cas_number__equal', casNumber);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.CHEMICALS}/?${params.toString()}`);
    if (response.data.results.length === 0) return null;
    return mapChemicalFromBaserow(response.data.results[0]);
  },

  search: async (query: string, limit = 10): Promise<Chemical[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('search', query);
    params.append('size', limit.toString());
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.CHEMICALS}/?${params.toString()}`);
    return response.data.results.map(mapChemicalFromBaserow);
  },
};

// Suppliers
export const suppliersApi = {
  getAll: async (page = 1, size = 20): Promise<{ results: Supplier[]; total: number }> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.SUPPLIERS}/?${params.toString()}`);
    return {
      results: response.data.results.map(mapSupplierFromBaserow),
      total: response.data.count,
    };
  },

  getById: async (id: string): Promise<Supplier> => {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLES.SUPPLIERS}/${id}/?user_field_names=true`
    );
    return mapSupplierFromBaserow(response.data);
  },

  getByChemical: async (chemicalId: string): Promise<Supplier[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__specialties__contains', chemicalId);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.SUPPLIERS}/?${params.toString()}`);
    return response.data.results.map(mapSupplierFromBaserow);
  },
};

// Product Offerings
export const offeringsApi = {
  getAll: async (filters?: SearchFilters, page = 1, size = 20): Promise<{ results: ProductOffering[]; total: number }> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    if (filters?.cas_number) {
      params.append('filter__cas_number__equal', filters.cas_number);
    }
    if (filters?.in_stock_only) {
      params.append('filter__is_stock_item__boolean', 'true');
    }
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.PRODUCT_OFFERINGS}/?${params.toString()}`);
    return {
      results: response.data.results.map(mapOfferingFromBaserow),
      total: response.data.count,
    };
  },

  getByChemical: async (chemicalId: string): Promise<ProductOffering[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__chemical_id__equal', chemicalId);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.PRODUCT_OFFERINGS}/?${params.toString()}`);
    return response.data.results.map(mapOfferingFromBaserow);
  },

  getBySupplier: async (supplierId: string): Promise<ProductOffering[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__supplier_id__equal', supplierId);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.PRODUCT_OFFERINGS}/?${params.toString()}`);
    return response.data.results.map(mapOfferingFromBaserow);
  },
};

// RFQs
export const rfqApi = {
  getAll: async (buyerId?: string): Promise<RFQSubmission[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    if (buyerId) {
      params.append('filter__buyer_id__equal', buyerId);
    }
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.RFQ_SUBMISSIONS}/?${params.toString()}`);
    return response.data.results.map(mapRFQFromBaserow);
  },

  getById: async (id: string): Promise<RFQSubmission> => {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLES.RFQ_SUBMISSIONS}/${id}/?user_field_names=true`
    );
    return mapRFQFromBaserow(response.data);
  },

  create: async (data: Partial<RFQSubmission>): Promise<RFQSubmission> => {
    const response = await baserowClient.post(
      `/api/database/rows/table/${TABLES.RFQ_SUBMISSIONS}/?user_field_names=true`,
      data
    );
    return mapRFQFromBaserow(response.data);
  },

  update: async (id: string, data: Partial<RFQSubmission>): Promise<RFQSubmission> => {
    const response = await baserowClient.patch(
      `/api/database/rows/table/${TABLES.RFQ_SUBMISSIONS}/${id}/?user_field_names=true`,
      data
    );
    return mapRFQFromBaserow(response.data);
  },
};

// Quotes
export const quotesApi = {
  getByRFQ: async (rfqId: string): Promise<Quote[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__rfq_id__equal', rfqId);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.QUOTES}/?${params.toString()}`);
    return response.data.results.map(mapQuoteFromBaserow);
  },

  getById: async (id: string): Promise<Quote> => {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLES.QUOTES}/${id}/?user_field_names=true`
    );
    return mapQuoteFromBaserow(response.data);
  },

  create: async (data: Partial<Quote>): Promise<Quote> => {
    const response = await baserowClient.post(
      `/api/database/rows/table/${TABLES.QUOTES}/?user_field_names=true`,
      data
    );
    return mapQuoteFromBaserow(response.data);
  },
};

// Orders
export const ordersApi = {
  getByBuyer: async (buyerId: string): Promise<Order[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__buyer_id__equal', buyerId);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.ORDERS}/?${params.toString()}`);
    return response.data.results.map(mapOrderFromBaserow);
  },

  getById: async (id: string): Promise<Order> => {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLES.ORDERS}/${id}/?user_field_names=true`
    );
    return mapOrderFromBaserow(response.data);
  },

  create: async (data: Partial<Order>): Promise<Order> => {
    const response = await baserowClient.post(
      `/api/database/rows/table/${TABLES.ORDERS}/?user_field_names=true`,
      data
    );
    return mapOrderFromBaserow(response.data);
  },

  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const response = await baserowClient.patch(
      `/api/database/rows/table/${TABLES.ORDERS}/${id}/?user_field_names=true`,
      data
    );
    return mapOrderFromBaserow(response.data);
  },
};

// Compliance
export const complianceApi = {
  getByCAS: async (casNumber: string): Promise<ComplianceRecord | null> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__cas_number__equal', casNumber);
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.COMPLIANCE_REGISTRY}/?${params.toString()}`);
    if (response.data.results.length === 0) return null;
    return mapComplianceFromBaserow(response.data.results[0]);
  },

  getReports: async (casNumber: string): Promise<ComplianceReport[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__cas_number__equal', casNumber);
    params.append('order_by', '-created_at');
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.COMPLIANCE_REPORTS}/?${params.toString()}`);
    return response.data.results.map(mapComplianceReportFromBaserow);
  },

  createReport: async (data: Partial<ComplianceReport>): Promise<ComplianceReport> => {
    const response = await baserowClient.post(
      `/api/database/rows/table/${TABLES.COMPLIANCE_REPORTS}/?user_field_names=true`,
      data
    );
    return mapComplianceReportFromBaserow(response.data);
  },
};

// Market Intelligence
export const intelligenceApi = {
  getByCAS: async (casNumber: string, limit = 10): Promise<MarketIntelligence[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__cas_number__equal', casNumber);
    params.append('order_by', '-period_end');
    params.append('size', limit.toString());
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.MARKET_INTELLIGENCE}/?${params.toString()}`);
    return response.data.results.map(mapIntelligenceFromBaserow);
  },

  getLatest: async (limit = 20): Promise<MarketIntelligence[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('order_by', '-created_at');
    params.append('size', limit.toString());
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.MARKET_INTELLIGENCE}/?${params.toString()}`);
    return response.data.results.map(mapIntelligenceFromBaserow);
  },

  getPriceHistory: async (casNumber: string, months = 12): Promise<{ date: string; price: number }[]> => {
    const intelligence = await intelligenceApi.getByCAS(casNumber, months);
    return intelligence
      .filter(i => i.avg_price_usd_kg > 0)
      .map(i => ({
        date: i.period_end,
        price: i.avg_price_usd_kg,
      }))
      .reverse();
  },
};

// Regulatory Alerts
export const alertsApi = {
  getAll: async (severity?: string): Promise<RegulatoryAlert[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('order_by', '-created_at');
    
    if (severity) {
      params.append('filter__severity__equal', severity);
    }
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.REGULATORY_ALERTS}/?${params.toString()}`);
    return response.data.results.map(mapAlertFromBaserow);
  },

  getByCAS: async (casNumber: string): Promise<RegulatoryAlert[]> => {
    const params = new URLSearchParams();
    params.append('user_field_names', 'true');
    params.append('filter__cas_numbers__contains', casNumber);
    params.append('order_by', '-created_at');
    
    const response = await baserowClient.get(`/api/database/rows/table/${TABLES.REGULATORY_ALERTS}/?${params.toString()}`);
    return response.data.results.map(mapAlertFromBaserow);
  },
};

// Helper functions to map Baserow responses to TypeScript types
function mapChemicalFromBaserow(row: any): Chemical {
  return {
    id: row.id.toString(),
    cas_number: row.cas_number || '',
    name: row.name || '',
    iupac_name: row.iupac_name || '',
    synonyms: row.synonyms ? JSON.parse(row.synonyms) : [],
    molecular_formula: row.molecular_formula || '',
    molecular_weight: row.molecular_weight || 0,
    description: row.description || '',
    category: row.category || 'solvents',
    grade: row.grade || 'technical',
    purity_min: row.purity_min || 0,
    purity_max: row.purity_max || 100,
    flashpoint_c: row.flashpoint_c,
    un_hazmat_number: row.un_hazmat_number,
    storage_conditions: row.storage_conditions || '',
    shelf_life_months: row.shelf_life_months || 12,
    sds_url: row.sds_url,
    coa_url: row.coa_url,
    image_url: row.image_url,
    is_active: row.is_active ?? true,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

function mapSupplierFromBaserow(row: any): Supplier {
  return {
    id: row.id.toString(),
    name: row.name || '',
    legal_name: row.legal_name || '',
    description: row.description || '',
    logo_url: row.logo_url,
    website: row.website,
    year_established: row.year_established || 2000,
    employee_count: row.employee_count || '1-50',
    annual_revenue: row.annual_revenue,
    certifications: row.certifications ? JSON.parse(row.certifications) : [],
    locations: row.locations ? JSON.parse(row.locations) : [],
    specialties: row.specialties ? JSON.parse(row.specialties) : [],
    moq_kg: row.moq_kg || 1,
    lead_time_days: row.lead_time_days || 7,
    payment_terms: row.payment_terms ? JSON.parse(row.payment_terms) : ['NET_30'],
    is_verified: row.is_verified ?? false,
    verification_date: row.verification_date,
    rating: row.rating || 0,
    review_count: row.review_count || 0,
    is_active: row.is_active ?? true,
  };
}

function mapOfferingFromBaserow(row: any): ProductOffering {
  return {
    id: row.id.toString(),
    chemical_id: row.chemical_id?.toString() || '',
    supplier_id: row.supplier_id?.toString() || '',
    chemical: row.chemical ? mapChemicalFromBaserow(row.chemical) : undefined as any,
    supplier: row.supplier ? mapSupplierFromBaserow(row.supplier) : undefined as any,
    sku: row.sku || '',
    grade: row.grade || 'technical',
    purity: row.purity || 0,
    unit: row.unit || 'kg',
    package_sizes: row.package_sizes ? JSON.parse(row.package_sizes) : [],
    moq: row.moq || 1,
    lead_time_days: row.lead_time_days || 7,
    incoterm: row.incoterm || 'EXW',
    is_stock_item: row.is_stock_item ?? false,
    stock_quantity: row.stock_quantity,
    pricing_model: row.pricing_model || 'fixed',
    price_tiers: row.price_tiers ? JSON.parse(row.price_tiers) : undefined,
    base_price: row.base_price,
    currency: row.currency || 'USD',
    is_active: row.is_active ?? true,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

function mapRFQFromBaserow(row: any): RFQSubmission {
  return {
    id: row.id.toString(),
    buyer_id: row.buyer_id?.toString() || '',
    title: row.title || '',
    status: row.status || 'draft',
    delivery_country: row.delivery_country || '',
    delivery_city: row.delivery_city,
    required_delivery_date: row.required_delivery_date || '',
    incoterm: row.incoterm || 'EXW',
    payment_terms: row.payment_terms || 'NET_30',
    additional_requirements: row.additional_requirements,
    compliance_requirements: row.compliance_requirements ? JSON.parse(row.compliance_requirements) : [],
    items: row.items ? JSON.parse(row.items) : [],
    quotes_received: row.quotes_received || 0,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    expires_at: row.expires_at || '',
  };
}

function mapQuoteFromBaserow(row: any): Quote {
  return {
    id: row.id.toString(),
    rfq_id: row.rfq_id?.toString() || '',
    supplier_id: row.supplier_id?.toString() || '',
    supplier: row.supplier ? mapSupplierFromBaserow(row.supplier) : undefined as any,
    status: row.status || 'draft',
    validity_days: row.validity_days || 30,
    expires_at: row.expires_at || '',
    incoterm: row.incoterm || 'EXW',
    payment_terms: row.payment_terms || 'NET_30',
    lead_time_days: row.lead_time_days || 7,
    shipping_cost: row.shipping_cost || 0,
    currency: row.currency || 'USD',
    notes: row.notes,
    terms_conditions: row.terms_conditions,
    items: row.items ? JSON.parse(row.items) : [],
    total_amount: row.total_amount || 0,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

function mapOrderFromBaserow(row: any): Order {
  return {
    id: row.id.toString(),
    quote_id: row.quote_id?.toString() || '',
    buyer_id: row.buyer_id?.toString() || '',
    supplier_id: row.supplier_id?.toString() || '',
    status: row.status || 'pending_payment',
    po_number: row.po_number,
    shipping_address: row.shipping_address || '',
    tracking_number: row.tracking_number,
    carrier: row.carrier,
    total_amount: row.total_amount || 0,
    currency: row.currency || 'USD',
    payment_status: row.payment_status || 'pending',
    payment_method: row.payment_method,
    payment_date: row.payment_date,
    expected_delivery: row.expected_delivery,
    actual_delivery: row.actual_delivery,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

function mapComplianceFromBaserow(row: any): ComplianceRecord {
  return {
    id: row.id.toString(),
    cas_number: row.cas_number || '',
    reach_status: row.reach_status || 'pending',
    reach_registration_number: row.reach_registration_number,
    tsca_status: row.tsca_status || 'not_listed',
    epa_status: row.epa_status || 'under_review',
    ghs_classification: row.ghs_classification ? JSON.parse(row.ghs_classification) : [],
    hazard_codes: row.hazard_codes ? JSON.parse(row.hazard_codes) : [],
    precautionary_statements: row.precautionary_statements ? JSON.parse(row.precautionary_statements) : [],
    last_updated: row.last_updated || new Date().toISOString(),
    next_review_date: row.next_review_date || '',
    documents: row.documents ? JSON.parse(row.documents) : [],
  };
}

function mapIntelligenceFromBaserow(row: any): MarketIntelligence {
  return {
    id: row.id.toString(),
    cas_number: row.cas_number || '',
    chemical_name: row.chemical_name || '',
    report_type: row.report_type || 'price_index',
    period_start: row.period_start || '',
    period_end: row.period_end || '',
    avg_price_usd_kg: row.avg_price_usd_kg || 0,
    price_change_percent: row.price_change_percent || 0,
    price_trend: row.price_trend || 'stable',
    supply_status: row.supply_status || 'normal',
    regional_availability: row.regional_availability ? JSON.parse(row.regional_availability) : [],
    key_insights: row.key_insights ? JSON.parse(row.key_insights) : [],
    generated_by: row.generated_by || 'automated',
    confidence_score: row.confidence_score || 0.8,
    created_at: row.created_at || new Date().toISOString(),
  };
}

function mapAlertFromBaserow(row: any): RegulatoryAlert {
  return {
    id: row.id.toString(),
    regulation_type: row.regulation_type || 'global',
    cas_numbers: row.cas_numbers ? JSON.parse(row.cas_numbers) : [],
    title: row.title || '',
    description: row.description || '',
    effective_date: row.effective_date || '',
    source_url: row.source_url,
    severity: row.severity || 'info',
    affected_chemicals_count: row.affected_chemicals_count || 0,
    created_at: row.created_at || new Date().toISOString(),
  };
}

function mapComplianceReportFromBaserow(row: any): ComplianceReport {
  return {
    id: row.id.toString(),
    cas_number: row.cas_number || '',
    chemical_name: row.chemical_name || '',
    report_type: row.report_type || 'full_assessment',
    generated_by: row.generated_by || 'ai',
    content: row.content || '',
    key_findings: row.key_findings ? JSON.parse(row.key_findings) : [],
    risk_level: row.risk_level || 'medium',
    recommendations: row.recommendations ? JSON.parse(row.recommendations) : [],
    valid_until: row.valid_until || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export default baserowClient;
