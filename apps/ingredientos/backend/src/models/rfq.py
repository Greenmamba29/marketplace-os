"""
RFQ (Request for Quote) models
"""

from typing import Optional, List
from pydantic import BaseModel, Field

from .common import TimestampMixin, Address


class AllergenRequirement(BaseModel):
    """Allergen requirement for RFQ"""
    allergen: str
    requirement: str = Field(..., pattern="^(free_from|may_contain_acceptable|no_restriction)$")


class RFQSubmissionBase(BaseModel):
    """Base RFQ submission model"""
    title: str
    description: str
    quantity_kg: int = Field(..., ge=1)
    delivery_timeline: str
    delivery_location: str
    application: str


class RFQSubmissionCreate(RFQSubmissionBase):
    """RFQ creation model"""
    ingredient_category: Optional[str] = None
    specific_ingredient_id: Optional[str] = None
    required_certifications: List[str] = []
    required_gras_status: bool = False
    allergen_requirements: List[AllergenRequirement] = []
    end_product_category: Optional[str] = None
    visibility: str = Field(default="public", pattern="^(public|private|invite_only)$")
    target_price: Optional[float] = None
    incoterm: str = Field(default="FOB", pattern="^(FOB|CIF|DDP|EXW)$")
    coa_required: bool = True
    sample_required: bool = True


class RFQSubmissionUpdate(BaseModel):
    """RFQ update model"""
    title: Optional[str] = None
    description: Optional[str] = None
    quantity_kg: Optional[int] = Field(None, ge=1)
    status: Optional[str] = Field(None, pattern="^(draft|published|under_review|closed|awarded|expired|cancelled)$")


class RFQSubmission(RFQSubmissionBase, TimestampMixin):
    """Complete RFQ submission model"""
    id: str
    buyer_id: str
    ingredient_category: Optional[str] = None
    specific_ingredient_id: Optional[str] = None
    required_certifications: List[str] = []
    required_gras_status: bool = False
    allergen_requirements: List[AllergenRequirement] = []
    end_product_category: Optional[str] = None
    visibility: str = "public"
    status: str = "draft"
    quote_count: int = 0
    expires_at: Optional[str] = None


class QuoteBase(BaseModel):
    """Base quote model"""
    unit_price: float = Field(..., ge=0)
    total_price: float = Field(..., ge=0)
    currency: str = Field(default="USD")
    lead_time_days: int = Field(..., ge=1)
    validity_days: int = Field(default=30, ge=1)


class QuoteCreate(QuoteBase):
    """Quote creation model"""
    incoterm: str = Field(default="FOB", pattern="^(FOB|CIF|DDP|EXW)$")
    certifications_included: List[str] = []
    coa_included: bool = True
    sample_available: bool = True
    notes: Optional[str] = None


class QuoteUpdate(BaseModel):
    """Quote update model"""
    unit_price: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern="^(submitted|under_review|accepted|rejected|expired|withdrawn)$")


class Quote(QuoteBase, TimestampMixin):
    """Complete quote model"""
    id: str
    rfq_id: str
    supplier_id: str
    incoterm: str
    certifications_included: List[str] = []
    coa_included: bool = True
    sample_available: bool = True
    status: str = "submitted"
    selected: bool = False
    selection_reason: Optional[str] = None
    notes: Optional[str] = None
