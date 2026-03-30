// ChemOS TypeScript Types

export interface Chemical {
  id: string;
  cas_number: string;
  name: string;
  iupac_name: string;
  synonyms: string[];
  molecular_formula: string;
  molecular_weight: number;
  description: string;
  category: ChemicalCategory;
  grade: ChemicalGrade;
  purity_min: number;
  purity_max: number;
  flashpoint_c?: number;
  un_hazmat_number?: string;
  storage_conditions: string;
  shelf_life_months: number;
  sds_url?: string;
  coa_url?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ChemicalCategory = 
  | 'solvents'
  | 'reagents'
  | 'catalysts'
  | 'polymers'
  | 'intermediates'
  | 'active_pharmaceutical_ingredients'
  | 'food_additives'
  | 'cosmetic_ingredients'
  | 'electronic_chemicals'
  | 'agrochemicals';

export type ChemicalGrade =
  | 'technical'
  | 'reagent'
  | 'acs'
  | 'pharmacopeia'
  | 'food'
  | 'cosmetic'
  | 'electronic'
  | 'spectrophotometric'
  | 'hplc'
  | 'gc_ms';

export interface ComplianceRecord {
  id: string;
  cas_number: string;
  reach_status: 'registered' | 'pre_registered' | 'exempt' | 'not_required' | 'pending';
  reach_registration_number?: string;
  tsca_status: 'listed' | 'exempt' | 'snur' | 'pmn' | 'not_listed';
  epa_status: 'approved' | 'restricted' | 'banned' | 'under_review';
  ghs_classification: string[];
  hazard_codes: string[];
  precautionary_statements: string[];
  last_updated: string;
  next_review_date: string;
  documents: ComplianceDocument[];
}

export interface ComplianceDocument {
  id: string;
  type: 'sds' | 'coa' | 'reach_dossier' | 'tsca_certificate' | 'safety_assessment';
  name: string;
  url: string;
  expiry_date?: string;
  uploaded_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  legal_name: string;
  description: string;
  logo_url?: string;
  website?: string;
  year_established: number;
  employee_count: string;
  annual_revenue?: string;
  certifications: string[];
  locations: SupplierLocation[];
  specialties: string[];
  moq_kg: number;
  lead_time_days: number;
  payment_terms: string[];
  is_verified: boolean;
  verification_date?: string;
  rating: number;
  review_count: number;
  is_active: boolean;
}

export interface SupplierLocation {
  id: string;
  type: 'headquarters' | 'manufacturing' | 'warehouse' | 'office';
  address: string;
  city: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
}

export interface ProductOffering {
  id: string;
  chemical_id: string;
  supplier_id: string;
  chemical: Chemical;
  supplier: Supplier;
  sku: string;
  grade: ChemicalGrade;
  purity: number;
  unit: 'kg' | 'g' | 'mg' | 'L' | 'mL';
  package_sizes: PackageSize[];
  moq: number;
  lead_time_days: number;
  incoterm: string;
  is_stock_item: boolean;
  stock_quantity?: number;
  pricing_model: 'fixed' | 'tiered' | 'negotiable';
  price_tiers?: PriceTier[];
  base_price?: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackageSize {
  size: number;
  unit: string;
  container_type: string;
  price: number;
}

export interface PriceTier {
  min_quantity: number;
  max_quantity?: number;
  unit_price: number;
}

export interface RFQSubmission {
  id: string;
  buyer_id: string;
  title: string;
  status: 'draft' | 'submitted' | 'in_review' | 'quoting' | 'closed' | 'cancelled';
  delivery_country: string;
  delivery_city?: string;
  required_delivery_date: string;
  incoterm: string;
  payment_terms: string;
  additional_requirements?: string;
  compliance_requirements: string[];
  items: RFQItem[];
  quotes_received: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface RFQItem {
  id: string;
  rfq_id: string;
  chemical_id?: string;
  cas_number: string;
  chemical_name: string;
  grade?: ChemicalGrade;
  purity_required?: number;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface Quote {
  id: string;
  rfq_id: string;
  supplier_id: string;
  supplier: Supplier;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'expired';
  validity_days: number;
  expires_at: string;
  incoterm: string;
  payment_terms: string;
  lead_time_days: number;
  shipping_cost: number;
  currency: string;
  notes?: string;
  terms_conditions?: string;
  items: QuoteItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  rfq_item_id: string;
  unit_price: number;
  quantity: number;
  unit: string;
  subtotal: number;
  availability_date: string;
  notes?: string;
}

export interface Order {
  id: string;
  quote_id: string;
  buyer_id: string;
  supplier_id: string;
  status: 'pending_payment' | 'payment_received' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  po_number?: string;
  shipping_address: string;
  tracking_number?: string;
  carrier?: string;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  payment_date?: string;
  expected_delivery?: string;
  actual_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface MarketIntelligence {
  id: string;
  cas_number: string;
  chemical_name: string;
  report_type: 'price_index' | 'supply_alert' | 'regulatory_change' | 'market_analysis';
  period_start: string;
  period_end: string;
  avg_price_usd_kg: number;
  price_change_percent: number;
  price_trend: 'up' | 'down' | 'stable';
  supply_status: 'abundant' | 'normal' | 'tight' | 'critical';
  regional_availability: RegionalAvailability[];
  key_insights: string[];
  generated_by: 'ai' | 'analyst' | 'automated';
  confidence_score: number;
  created_at: string;
}

export interface RegionalAvailability {
  region: string;
  availability: 'high' | 'medium' | 'low';
  avg_lead_time_days: number;
  avg_price_premium: number;
}

export interface RegulatoryAlert {
  id: string;
  regulation_type: 'reach' | 'tsca' | 'epa' | 'fda' | 'global';
  cas_numbers: string[];
  title: string;
  description: string;
  effective_date: string;
  source_url?: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  affected_chemicals_count: number;
  created_at: string;
}

export interface ComplianceReport {
  id: string;
  cas_number: string;
  chemical_name: string;
  report_type: 'full_assessment' | 'reach_summary' | 'tsca_check' | 'safety_review';
  generated_by: 'ai' | 'manual';
  content: string;
  key_findings: string[];
  risk_level: 'low' | 'medium' | 'high';
  recommendations: string[];
  valid_until: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  role: 'buyer' | 'supplier' | 'admin';
  is_verified: boolean;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SearchFilters {
  query?: string;
  cas_number?: string;
  category?: ChemicalCategory;
  grade?: ChemicalGrade;
  min_purity?: number;
  max_purity?: number;
  compliance_status?: string[];
  supplier_country?: string[];
  in_stock_only?: boolean;
  min_quantity?: number;
  max_price?: number;
}

export interface DashboardStats {
  total_rfqs: number;
  active_rfqs: number;
  quotes_received: number;
  orders_placed: number;
  orders_in_transit: number;
  total_spend: number;
  pending_compliance_reviews: number;
}

export interface PriceIndexData {
  date: string;
  price: number;
  volume: number;
}

export interface ACCIORequest {
  id: string;
  buyer_id: string;
  description: string;
  requirements: string[];
  status: 'analyzing' | 'sourcing' | 'quoting' | 'completed' | 'failed';
  matched_chemicals: MatchedChemical[];
  created_at: string;
  completed_at?: string;
}

export interface MatchedChemical {
  cas_number: string;
  name: string;
  confidence: number;
  reason: string;
}
