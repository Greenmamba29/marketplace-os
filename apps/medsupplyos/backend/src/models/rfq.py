"""RFQ and Quote models."""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class RFQStatus(str, Enum):
    """RFQ status enumeration."""
    DRAFT = "draft"
    PENDING_CLINICAL_APPROVAL = "pending_clinical_approval"
    PENDING_BUDGET_APPROVAL = "pending_budget_approval"
    APPROVED = "approved"
    SENT_TO_SUPPLIERS = "sent_to_suppliers"
    QUOTES_RECEIVED = "quotes_received"
    UNDER_EVALUATION = "under_evaluation"
    AWARDED = "awarded"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class RFQPriority(str, Enum):
    """RFQ priority enumeration."""
    ROUTINE = "routine"
    URGENT = "urgent"
    EMERGENCY = "emergency"
    CRITICAL = "critical"


class QuoteStatus(str, Enum):
    """Quote status enumeration."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class RFQItem(BaseModel):
    """RFQ line item."""
    id: str
    equipment_id: Optional[str] = None
    description: str
    quantity: int = Field(..., ge=1)
    unit_of_measure: str = "each"
    target_price: Optional[Decimal] = None
    required_specifications: Optional[str] = None
    preferred_brands: Optional[str] = None
    clinical_requirements: Optional[str] = None


class BudgetApproval(BaseModel):
    """Budget approval record."""
    approver_id: str
    approved_at: datetime
    approved_amount: Decimal
    comments: Optional[str] = None


class ClinicalApproval(BaseModel):
    """Clinical approval record."""
    approver_id: str
    approved_at: datetime
    clinical_indication: str
    patient_safety_impact: str
    comments: Optional[str] = None


class RFQTimeline(BaseModel):
    """RFQ timeline."""
    required_by: datetime
    quote_deadline: Optional[datetime] = None
    expected_delivery: Optional[datetime] = None
    created_at: datetime


class RFQBase(BaseModel):
    """Base RFQ model."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: RFQPriority = RFQPriority.ROUTINE


class RFQCreate(RFQBase):
    """RFQ creation model."""
    facility_id: str
    department_id: Optional[str] = None
    items: List[RFQItem]
    clinical_justification: Optional[str] = None
    patient_impact: Optional[str] = None
    budget_code: Optional[str] = None
    required_by: datetime
    quote_deadline: Optional[datetime] = None


class RFQUpdate(BaseModel):
    """RFQ update model."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Optional[RFQPriority] = None
    items: Optional[List[RFQItem]] = None
    clinical_justification: Optional[str] = None
    patient_impact: Optional[str] = None


class RFQ(RFQBase):
    """Full RFQ model."""
    id: str
    rfq_number: str
    requester_id: str
    organization_id: str
    department_id: Optional[str]
    facility_id: str
    status: RFQStatus
    items: List[RFQItem]
    clinical_justification: Optional[str]
    patient_impact: Optional[str]
    budget_approval: Optional[BudgetApproval] = None
    clinical_approval: Optional[ClinicalApproval] = None
    timeline: RFQTimeline
    selected_quote_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class QuoteItemAlternative(BaseModel):
    """Quote item alternative."""
    equipment_id: str
    description: str
    unit_price: Decimal
    availability: str


class QuoteItem(BaseModel):
    """Quote line item."""
    id: str
    rfq_item_id: str
    equipment_id: Optional[str] = None
    description: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    availability: str
    lead_time_days: int
    alternatives: List[QuoteItemAlternative] = Field(default_factory=list)


class QuoteTerms(BaseModel):
    """Quote terms."""
    payment_terms: str
    shipping_terms: str
    warranty: str
    return_policy: str


class QuoteValidity(BaseModel):
    """Quote validity period."""
    valid_from: datetime
    valid_until: datetime


class QuoteBase(BaseModel):
    """Base quote model."""
    notes: Optional[str] = None


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    items: List[QuoteItem]
    terms: QuoteTerms
    validity: QuoteValidity
    total_amount: Decimal


class Quote(QuoteBase):
    """Full quote model."""
    id: str
    quote_number: str
    rfq_id: str
    supplier_id: str
    status: QuoteStatus
    items: List[QuoteItem]
    terms: QuoteTerms
    validity: QuoteValidity
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}
