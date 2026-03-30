// ============================================
// GovSource Marketplace - TypeScript Types
// Government Procurement Marketplace
// ============================================

// Set-Aside Types
export type SetAsideType = 
  | '8(a)'
  | 'HUBZone'
  | 'SDVOSB'
  | 'WOSB'
  | 'EDWOSB'
  | 'VOSB'
  | 'SDB'
  | 'NONE';

// Security Clearance Levels
export type SecurityClearance = 
  | 'TS/SCI'
  | 'Top Secret'
  | 'Secret'
  | 'Confidential'
  | 'Public Trust'
  | 'None';

// SAM.gov Registration Status
export type SamStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'EXPIRED'
  | 'PENDING'
  | 'SUSPENDED';

// Vendor Qualification Status
export type QualificationStatus = 
  | 'QUALIFIED'
  | 'PENDING'
  | 'DISQUALIFIED'
  | 'EXPIRED'
  | 'UNDER_REVIEW';

// RFP Status
export type RFPStatus = 
  | 'DRAFT'
  | 'PUBLISHED'
  | 'OPEN'
  | 'CLOSED'
  | 'AWARDED'
  | 'CANCELLED';

// Contract Types
export type ContractType = 
  | 'FIRM_FIXED_PRICE'
  | 'COST_PLUS'
  | 'TIME_MATERIALS'
  | 'IDIQ'
  | 'BPA'
  | 'SINGLE_AWARD';

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agency?: GovernmentAgency;
  vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 
  | 'BUYER'
  | 'VENDOR'
  | 'ADMIN'
  | 'CONTRACTING_OFFICER'
  | 'COMPLIANCE_OFFICER';

export interface GovernmentAgency {
  id: string;
  name: string;
  code: string;
  department: string;
  contractingOfficerName?: string;
  contractingOfficerEmail?: string;
}

// ============================================
// Vendor Types
// ============================================

export interface Vendor {
  id: string;
  userId: string;
  companyName: string;
  dbaName?: string;
  cageCode: string;
  uei?: string;
  samRegistration: SAMRegistration;
  naicsCodes: NAICSCode[];
  pscCodes: PSCCode[];
  setAsides: SetAsideType[];
  securityClearance?: SecurityClearance;
  clearanceExpiration?: string;
  qualifications: VendorQualification[];
  pastPerformance: PastPerformance[];
  certifications: Certification[];
  contactInfo: VendorContactInfo;
  financialInfo: VendorFinancialInfo;
  complianceStatus: ComplianceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SAMRegistration {
  status: SamStatus;
  registrationDate: string;
  expirationDate: string;
  lastUpdated: string;
  samUei: string;
  legalBusinessName: string;
  physicalAddress: Address;
  congressionalDistrict: string;
  businessStartDate: string;
  fiscalYearEnd: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface NAICSCode {
  code: string;
  description: string;
  isPrimary: boolean;
  sizeStandard: string;
}

export interface PSCCode {
  code: string;
  description: string;
}

export interface VendorQualification {
  id: string;
  type: string;
  status: QualificationStatus;
  issuedDate?: string;
  expirationDate?: string;
  issuingAgency?: string;
  documentUrl?: string;
  notes?: string;
}

export interface PastPerformance {
  id: string;
  contractNumber: string;
  agencyName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  naicsCode: string;
  description: string;
  rating?: number;
  cparsAvailable: boolean;
}

export interface Certification {
  id: string;
  type: string;
  name: string;
  issuingBody: string;
  issueDate: string;
  expirationDate: string;
  documentUrl?: string;
}

export interface VendorContactInfo {
  primaryContact: string;
  phone: string;
  email: string;
  website?: string;
  businessAddress: Address;
}

export interface VendorFinancialInfo {
  annualRevenue?: number;
  numberOfEmployees?: number;
  isSmallBusiness: boolean;
  businessType: string[];
}

export interface ComplianceStatus {
  overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  farCompliance: boolean;
  dfarsCompliance: boolean;
  debarred: boolean;
  suspended: boolean;
  lastChecked: string;
}

// ============================================
// RFP Types
// ============================================

export interface RFP {
  id: string;
  solicitationNumber: string;
  title: string;
  description: string;
  agency: GovernmentAgency;
  status: RFPStatus;
  naicsCodes: string[];
  pscCodes: string[];
  setAside: SetAsideType;
  contractType: ContractType;
  estimatedValue: {
    min: number;
    max: number;
  };
  periodOfPerformance: {
    basePeriod: number;
    optionPeriods: number;
    totalMonths: number;
  };
  securityClearanceRequired: SecurityClearance;
  importantDates: {
    issueDate: string;
    questionsDue: string;
    proposalDue: string;
    awardDate?: string;
  };
  farClauses: FARClause[];
  evaluationCriteria: EvaluationCriteria[];
  attachments: RFPAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface FARClause {
  number: string;
  title: string;
  description: string;
  isFlowDown: boolean;
  applicable: boolean;
}

export interface EvaluationCriteria {
  factor: string;
  weight: number;
  description: string;
}

export interface RFPAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// ============================================
// RFQ Types
// ============================================

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  agencyId: string;
  rfpId?: string;
  status: RFQStatus;
  lineItems: RFQLineItem[];
  deliveryRequirements: DeliveryRequirements;
  terms: RFQTerms;
  invitedVendors: string[];
  quotes: Quote[];
  approvalChain: ApprovalStep[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type RFQStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SENT'
  | 'OPEN'
  | 'CLOSED'
  | 'AWARDED'
  | 'CANCELLED';

export interface RFQLineItem {
  id: string;
  lineNumber: number;
  description: string;
  nsn?: string;
  partNumber?: string;
  quantity: number;
  unit: string;
  requiredDeliveryDate: string;
  specifications?: string;
}

export interface DeliveryRequirements {
  fobDestination: boolean;
  shippingAddress: Address;
  requiredDate: string;
  partialShipmentsAllowed: boolean;
}

export interface RFQTerms {
  paymentTerms: string;
  netDays: number;
  discountTerms?: string;
  warranty?: string;
}

export interface Quote {
  id: string;
  vendorId: string;
  rfqId: string;
  status: QuoteStatus;
  lineItemQuotes: LineItemQuote[];
  totalPrice: number;
  deliveryDays: number;
  validityDays: number;
  technicalProposal?: string;
  pastPerformance?: string;
  submittedAt?: string;
  expiresAt?: string;
}

export type QuoteStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_EVALUATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export interface LineItemQuote {
  lineItemId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  deliveryDays: number;
  partNumber?: string;
  notes?: string;
}

export interface ApprovalStep {
  step: number;
  role: string;
  approverId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  actionedAt?: string;
}

// ============================================
// Compliance Types
// ============================================

export interface FARCompliance {
  id: string;
  vendorId: string;
  clauseNumber: string;
  clauseTitle: string;
  applicable: boolean;
  certified: boolean;
  certificationDate?: string;
  expirationDate?: string;
  documentUrl?: string;
  notes?: string;
}

export interface DFARSCompliance {
  id: string;
  vendorId: string;
  clauseNumber: string;
  clauseTitle: string;
  applicable: boolean;
  certified: boolean;
  certificationDate?: string;
  expirationDate?: string;
  documentUrl?: string;
  cyberComplianceLevel?: string;
}

export interface ComplianceRecord {
  id: string;
  vendorId: string;
  type: 'FAR' | 'DFARS' | 'AGENCY_SPECIFIC';
  requirement: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'WAIVED';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  documents: string[];
}

// ============================================
// Set-Aside Tracking
// ============================================

export interface SetAsideTracking {
  id: string;
  vendorId: string;
  setAsideType: SetAsideType;
  certified: boolean;
  certificationBody?: string;
  certificationDate?: string;
  expirationDate?: string;
  documentUrl?: string;
  sbaProfileUrl?: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED';
}

// ============================================
// Order Types
// ============================================

export interface Order {
  id: string;
  orderNumber: string;
  rfqId: string;
  quoteId: string;
  vendorId: string;
  agencyId: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  totalValue: number;
  fundingInfo: FundingInfo;
  deliveryInfo: DeliveryInfo;
  modifications: OrderModification[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'INVOICED'
  | 'PAID'
  | 'CLOSED'
  | 'CANCELLED';

export interface OrderLineItem {
  id: string;
  rfqLineItemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

export interface FundingInfo {
  appropriationYear: string;
  objectClassCode: string;
  accountingCode: string;
  obligatedAmount: number;
}

export interface DeliveryInfo {
  requiredDate: string;
  actualDate?: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface OrderModification {
  id: string;
  type: string;
  description: string;
  valueChange: number;
  approvedBy: string;
  approvedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// ============================================
// Filter Types
// ============================================

export interface VendorFilter {
  search?: string;
  naicsCodes?: string[];
  pscCodes?: string[];
  setAsides?: SetAsideType[];
  securityClearance?: SecurityClearance;
  samStatus?: SamStatus;
  state?: string;
  smallBusiness?: boolean;
  qualifiedOnly?: boolean;
}

export interface RFPFilter {
  search?: string;
  agency?: string;
  naicsCodes?: string[];
  setAside?: SetAsideType;
  status?: RFPStatus;
  minValue?: number;
  maxValue?: number;
  securityClearance?: SecurityClearance;
}

// ============================================
// Dashboard Types
// ============================================

export interface BuyerDashboard {
  activeRFQs: number;
  pendingQuotes: number;
  activeOrders: number;
  totalSpent: number;
  recentActivity: ActivityItem[];
  upcomingDeadlines: DeadlineItem[];
}

export interface VendorDashboard {
  openRFPs: number;
  pendingQuotes: number;
  activeOrders: number;
  totalRevenue: number;
  winRate: number;
  recentActivity: ActivityItem[];
  upcomingDeadlines: DeadlineItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  entityType: string;
  entityId: string;
}

export interface DeadlineItem {
  id: string;
  type: string;
  title: string;
  deadline: string;
  entityType: string;
  entityId: string;
}

// ============================================
// SAM.gov Integration Types
// ============================================

export interface SamGovEntity {
  entityRegistration: {
    ueiSAM: string;
    legalBusinessName: string;
    dbaName?: string;
    cageCode: string;
    registrationStatus: string;
    registrationDate: string;
    expirationDate: string;
  };
  physicalAddress: {
    addressLine1: string;
    city: string;
    stateOrProvinceCode: string;
    zipCode: string;
    countryCode: string;
  };
  businessTypes: string[];
  naicsCodes: {
    naicsCode: string;
    naicsDescription: string;
    isPrimary: string;
  }[];
}

export interface SamGovSearchParams {
  uei?: string;
  cageCode?: string;
  legalBusinessName?: string;
  naicsCode?: string;
  state?: string;
  registrationStatus?: string;
}
