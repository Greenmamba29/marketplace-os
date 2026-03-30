// BarrelHub TypeScript Types

export type SpiritType = 'bourbon' | 'rye' | 'scotch' | 'rum' | 'tequila' | 'brandy' | 'other';
export type StorageType = 'new_charred_oak' | 'used_bourbon' | 'used_wine' | 'sherry_cask' | 'port_cask';
export type BarrelStatus = 'available' | 'reserved' | 'sold' | 'aging' | 'bottled';
export type TaxStampStatus = 'bonded' | 'tax_paid' | 'in_transit' | 'exported';
export type TTBStatus = 'verified' | 'pending' | 'expired' | 'suspended';
export type RFQStatus = 'draft' | 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'expired';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type OrderStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  company_name: string;
  role: 'buyer' | 'supplier' | 'admin';
  ttb_permit_number?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barrel {
  id: string;
  barrel_number: string;
  spirit_type: SpiritType;
  age_statement?: number;
  entry_date: string;
  projected_bottling_date?: string;
  mash_bill: string;
  distillery_origin: string;
  storage_type: StorageType;
  proof: number;
  volume_gallons: number;
  volume_proof_gallons: number;
  ttb_permit_number: string;
  tax_stamp_status: TaxStampStatus;
  warehouse_location: string;
  status: BarrelStatus;
  supplier_id: string;
  supplier_name: string;
  price_per_proof_gallon?: number;
  total_value?: number;
  created_at: string;
  updated_at: string;
}

export interface BarrelRegistry {
  id: string;
  barrel_id: string;
  barrel_number: string;
  fill_date: string;
  original_proof: number;
  original_volume: number;
  current_proof: number;
  current_volume: number;
  angel_share_loss: number;
  warehouse_location: string;
  rack_number: string;
  tier_position: string;
  sample_history: SampleRecord[];
  movement_history: MovementRecord[];
  created_at: string;
  updated_at: string;
}

export interface SampleRecord {
  date: string;
  proof: number;
  volume: number;
  sample_type: 'routine' | 'customer' | 'quality';
  notes?: string;
}

export interface MovementRecord {
  date: string;
  from_location: string;
  to_location: string;
  reason: string;
  authorized_by: string;
}

export interface TTBCompliance {
  id: string;
  permit_number: string;
  company_name: string;
  permit_type: 'dsp' | 'bwg' | 'importer' | 'exporter';
  status: TTBStatus;
  issue_date: string;
  expiration_date: string;
  bond_amount?: number;
  bond_surety?: string;
  premises_address: string;
  verified_at: string;
  verified_by: string;
  notes?: string;
}

export interface SensoryProfile {
  id: string;
  barrel_id: string;
  barrel_number: string;
  evaluation_date: string;
  evaluator: string;
  overall_score: number;
  appearance: {
    color: string;
    clarity: number;
    viscosity: number;
  };
  nose: {
    intensity: number;
    vanilla: number;
    caramel: number;
    oak: number;
    spice: number;
    fruit: number;
    floral: number;
    smoke: number;
    other_notes: string;
  };
  palate: {
    intensity: number;
    sweetness: number;
    vanilla: number;
    caramel: number;
    oak: number;
    spice: number;
    fruit: number;
    body: number;
    complexity: number;
  };
  finish: {
    length: number;
    warmth: number;
    aftertaste: number;
  };
  tasting_notes: string;
  recommended_use: string;
}

export interface MarketComp {
  id: string;
  transaction_date: string;
  spirit_type: SpiritType;
  age_years: number;
  proof: number;
  volume_proof_gallons: number;
  price_per_proof_gallon: number;
  total_price: number;
  seller: string;
  buyer: string;
  barrel_count: number;
  source: 'auction' | 'private_sale' | 'distillery' | 'broker';
  notes?: string;
  created_at: string;
}

export interface RFQ {
  id: string;
  rfq_number: string;
  buyer_id: string;
  buyer_company: string;
  status: RFQStatus;
  spirit_type: SpiritType;
  age_preference: {
    min_age?: number;
    max_age?: number;
    specific_age?: number;
  };
  proof_requirements: {
    min_proof: number;
    max_proof: number;
    target_proof?: number;
  };
  volume_required: number;
  delivery_timeline: string;
  budget_range?: {
    min?: number;
    max?: number;
  };
  special_requirements?: string;
  ttb_compliance_required: boolean;
  sensory_preferences?: string;
  submitted_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  quotes?: Quote[];
}

export interface Quote {
  id: string;
  quote_number: string;
  rfq_id: string;
  supplier_id: string;
  supplier_name: string;
  barrel_ids: string[];
  price_per_proof_gallon: number;
  total_price: number;
  delivery_terms: string;
  payment_terms: string;
  validity_period: number;
  status: QuoteStatus;
  notes?: string;
  submitted_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  quote_id: string;
  buyer_id: string;
  supplier_id: string;
  barrel_ids: string[];
  total_volume: number;
  total_price: number;
  status: OrderStatus;
  shipping_address: string;
  tracking_number?: string;
  carrier?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  spirit_type?: SpiritType[];
  age_min?: number;
  age_max?: number;
  proof_min?: number;
  proof_max?: number;
  price_min?: number;
  price_max?: number;
  distillery?: string[];
  storage_type?: StorageType[];
  status?: BarrelStatus[];
  location?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  code?: string;
  field?: string;
}
