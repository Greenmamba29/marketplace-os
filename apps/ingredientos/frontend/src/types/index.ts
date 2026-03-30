// ============================================
// IngredientOS Type Definitions
// Specialty Food & Beverage Ingredients Marketplace
// ============================================

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  company_name: string;
  role: 'buyer' | 'supplier' | 'admin';
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  description: string;
  website?: string;
  country: string;
  certifications: string[];
  years_in_business: number;
  verified: boolean;
  rating: number;
  review_count: number;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
}

// Certification Types
export interface Certification {
  id: string;
  name: string;
  type: 'organic' | 'non_gmo' | 'kosher' | 'halal' | 'gras' | 'other';
  issuer: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  document_url?: string;
  verified: boolean;
}

// GRAS Status Types
export interface GRASStatus {
  id: string;
  ingredient_id: string;
  status: 'gras' | 'nda' | 'pending' | 'not_submitted';
  fdn_number?: string;
  notification_date?: string;
  fda_response?: 'no_questions' | 'questions' | 'pending' | 'not_applicable';
  self_affirmed: boolean;
  expert_panel_date?: string;
  safety_studies_url?: string;
}

// Allergen Types
export interface AllergenProfile {
  id: string;
  ingredient_id: string;
  contains_major_allergens: boolean;
  major_allergens: AllergenType[];
  may_contain: AllergenType[];
  processed_on_shared_equipment: boolean;
  allergen_statement: string;
  fda_compliant: boolean;
}

export type AllergenType =
  | 'milk'
  | 'eggs'
  | 'fish'
  | 'crustacean_shellfish'
  | 'tree_nuts'
  | 'peanuts'
  | 'wheat'
  | 'soybeans'
  | 'sesame'
  | 'sulfites'
  | 'gluten';

// Functional Claims Types
export interface FunctionalClaim {
  id: string;
  ingredient_id: string;
  claim: string;
  claim_type: 'structure_function' | 'health_claim' | 'nutrient_content' | 'qualified_health';
  regulatory_status: 'approved' | 'pending' | 'self_substantiated' | 'not_applicable';
  substantiation_documents: string[];
  fda_notification_number?: string;
}

// Ingredient Types
export interface Ingredient {
  id: string;
  name: string;
  description: string;
  category: IngredientCategory;
  subcategory?: string;
  supplier: Supplier;
  supplier_id: string;
  
  // Pricing
  price_per_kg: number;
  moq_kg: number;
  price_tier: 'economy' | 'standard' | 'premium' | 'specialty';
  
  // Specifications
  specifications: IngredientSpecs;
  
  // Regulatory
  regulatory_status: RegulatoryStatus;
  certifications: Certification[];
  allergen_profile: AllergenProfile;
  functional_claims: FunctionalClaim[];
  gras_status: GRASStatus;
  
  // Origin & Traceability
  country_of_origin: string;
  lot_traceable: boolean;
  coa_available: boolean;
  
  // Documentation
  sds_url?: string;
  coa_template_url?: string;
  product_data_sheet_url?: string;
  
  // Status
  status: 'active' | 'inactive' | 'pending_approval' | 'discontinued';
  featured: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export type IngredientCategory =
  | 'sweeteners'
  | 'flavors'
  | 'colors'
  | 'preservatives'
  | 'emulsifiers'
  | 'stabilizers'
  | 'thickeners'
  | 'antioxidants'
  | 'acids'
  | 'bases'
  | 'enzymes'
  | 'probiotics'
  | 'proteins'
  | 'fibers'
  | 'oils_fats'
  | 'extracts'
  | 'vitamins_minerals'
  | 'specialty';

export interface IngredientSpecs {
  brix?: number;
  viscosity_cp?: number;
  moisture_percent?: number;
  ph?: number;
  particle_size_mesh?: number;
  bulk_density_g_ml?: number;
  solubility?: string;
  shelf_life_months: number;
  storage_conditions: string;
}

export interface RegulatoryStatus {
  us_fda_status: 'approved' | 'pending' | 'restricted' | 'not_applicable';
  eu_efsa_status: 'approved' | 'pending' | 'restricted' | 'not_applicable';
  fda_regulation_number?: string;
  e_number?: string;
}

// RFQ Types
export interface RFQSubmission {
  id: string;
  buyer_id: string;
  buyer: User;
  title: string;
  description: string;
  
  // Ingredient Requirements
  ingredient_category?: IngredientCategory;
  specific_ingredient_id?: string;
  
  // Quantity & Timeline
  quantity_kg: number;
  delivery_timeline: string;
  delivery_location: string;
  
  // Certification Requirements
  required_certifications: string[];
  required_gras_status: boolean;
  allergen_requirements: AllergenRequirement[];
  
  // Application Details
  application: string;
  end_product_category?: string;
  
  // Status
  status: RFQStatus;
  visibility: 'public' | 'private' | 'invite_only';
  
  // Responses
  quotes: Quote[];
  quote_count: number;
  
  // Metadata
  created_at: string;
  expires_at: string;
  updated_at: string;
}

export type RFQStatus = 'draft' | 'published' | 'under_review' | 'closed' | 'awarded' | 'expired' | 'cancelled';

export interface AllergenRequirement {
  allergen: AllergenType;
  requirement: 'free_from' | 'may_contain_acceptable' | 'no_restriction';
}

// Quote Types
export interface Quote {
  id: string;
  rfq_id: string;
  supplier_id: string;
  supplier: Supplier;
  
  // Pricing
  unit_price: number;
  total_price: number;
  currency: string;
  
  // Terms
  incoterm: string;
  lead_time_days: number;
  validity_days: number;
  
  // Compliance
  certifications_included: string[];
  coa_included: boolean;
  sample_available: boolean;
  
  // Status
  status: QuoteStatus;
  
  // Selection
  selected: boolean;
  selection_reason?: string;
  
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

// Order Types
export interface Order {
  id: string;
  quote_id: string;
  rfq_id: string;
  buyer_id: string;
  supplier_id: string;
  
  // Items
  ingredient: Ingredient;
  quantity_kg: number;
  unit_price: number;
  total_amount: number;
  
  // Status
  status: OrderStatus;
  
  // Shipping
  shipping_address: Address;
  tracking_number?: string;
  estimated_delivery?: string;
  
  // Documentation
  coa_url?: string;
  batch_number?: string;
  
  // Payment
  payment_status: PaymentStatus;
  
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Address {
  street: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

// Dashboard Types
export interface BuyerDashboardStats {
  total_orders: number;
  active_rfqs: number;
  pending_quotes: number;
  total_spent: number;
  savings_vs_traditional: number;
  average_order_value: number;
  supplier_count: number;
  on_time_delivery_rate: number;
}

export interface SupplierDashboardStats {
  total_quotes_submitted: number;
  quote_win_rate: number;
  active_orders: number;
  total_revenue: number;
  pending_rfqs: number;
  average_response_time_hours: number;
  customer_rating: number;
}

export interface AdminDashboardStats {
  total_users: number;
  total_suppliers: number;
  total_ingredients: number;
  total_orders: number;
  gmv: number;
  pending_verifications: number;
  compliance_alerts: number;
}

// Filter Types
export interface IngredientFilters {
  category?: IngredientCategory;
  price_min?: number;
  price_max?: number;
  certifications?: string[];
  gras_status?: string;
  allergen_free?: AllergenType[];
  country_of_origin?: string[];
  organic_only?: boolean;
  non_gmo_only?: boolean;
  kosher_only?: boolean;
  halal_only?: boolean;
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Compliance Document Types
export interface ComplianceDocument {
  id: string;
  ingredient_id: string;
  document_type: 'coa' | 'sds' | 'gras_notification' | 'certification' | 'allergen_statement' | 'spec_sheet';
  file_name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
  expiry_date?: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
}

// Food Defense Types
export interface FoodDefenseDoc {
  id: string;
  supplier_id: string;
  document_type: 'fsma_compliance' | 'food_defense_plan' | 'intentional_adulteration' | 'supply_chain_program';
  status: 'compliant' | 'pending' | 'non_compliant' | 'under_review';
  document_url?: string;
  last_audit_date?: string;
  next_audit_date?: string;
  notes?: string;
}
