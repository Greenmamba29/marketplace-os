"""RFQ models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class RFQStatus(str, Enum):
    """RFQ statuses."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    QUOTING = "quoting"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class Incoterm(str, Enum):
    """Incoterms."""
    EXW = "EXW"
    FOB = "FOB"
    CIF = "CIF"
    DAP = "DAP"
    DDP = "DDP"


class PaymentTerms(str, Enum):
    """Payment terms."""
    NET_30 = "NET_30"
    NET_60 = "NET_60"
    NET_90 = "NET_90"
    LC = "LC"
    PREPAID = "PREPAID"


class ChemicalGrade(str, Enum):
    """Chemical grades."""
    TECHNICAL = "technical"
    REAGENT = "reagent"
    ACS = "acs"
    PHARMACOPEIA = "pharmacopeia"
    FOOD = "food"
    COSMETIC = "cosmetic"
    ELECTRONIC = "electronic"
    HPLC = "hplc"
    GC_MS = "gc_ms"


class Unit(str, Enum):
    """Units of measurement."""
    KG = "kg"
    G = "g"
    MG = "mg"
    L = "L"
    ML = "mL"


class RFQItemBase(BaseModel):
    """Base RFQ item model."""
    cas_number: str = Field(..., pattern=r"^\d{2,7}-\d{2}-\d$")
    chemical_name: str
    grade: Optional[ChemicalGrade] = None
    purity_required: Optional[float] = Field(None, ge=0, le=100)
    quantity: float = Field(..., gt=0)
    unit: Unit = Unit.KG
    notes: Optional[str] = None


class RFQItemCreate(RFQItemBase):
    """RFQ item creation model."""
    pass


class RFQItem(RFQItemBase):
    """RFQ item response model."""
    id: str
    rfq_id: str

    class Config:
        from_attributes = True


class RFQSubmissionBase(BaseModel):
    """Base RFQ submission model."""
    title: str = Field(..., min_length=3, max_length=200)
    delivery_country: str
    delivery_city: Optional[str] = None
    required_delivery_date: datetime
    incoterm: Incoterm = Incoterm.EXW
    payment_terms: PaymentTerms = PaymentTerms.NET_30
    additional_requirements: Optional[str] = None
    compliance_requirements: List[str] = []


class RFQSubmissionCreate(RFQSubmissionBase):
    """RFQ submission creation model."""
    items: List[RFQItemCreate] = Field(..., min_length=1)


class RFQSubmissionUpdate(BaseModel):
    """RFQ submission update model."""
    title: Optional[str] = None
    status: Optional[RFQStatus] = None
    delivery_country: Optional[str] = None
    delivery_city: Optional[str] = None
    required_delivery_date: Optional[datetime] = None
    incoterm: Optional[Incoterm] = None
    payment_terms: Optional[PaymentTerms] = None
    additional_requirements: Optional[str] = None
    compliance_requirements: Optional[List[str]] = None


class RFQSubmission(RFQSubmissionBase):
    """RFQ submission response model."""
    id: str
    buyer_id: str
    status: RFQStatus
    items: List[RFQItem]
    quotes_received: int
    created_at: datetime
    updated_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True


class RFQListResponse(BaseModel):
    """RFQ list response."""
    items: List[RFQSubmission]
    total: int
    page: int
    size: int
