"""
RFQ (Request for Quote) Models for LabSource
"""

from datetime import datetime, date
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict

from .common import Address


class RFQStatus(str, Enum):
    """RFQ status values."""
    DRAFT = "draft"
    PUBLISHED = "published"
    UNDER_REVIEW = "under-review"
    CLOSED = "closed"
    AWARDED = "awarded"


class GrantAgency(str, Enum):
    """Grant funding agencies."""
    NSF = "NSF"
    NIH = "NIH"
    DOE = "DOE"
    DOD = "DOD"
    USDA = "USDA"
    OTHER = "other"


class QuoteStatus(str, Enum):
    """Quote status values."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under-review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class RFQItem(BaseModel):
    """Individual item in an RFQ."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    reagent_id: Optional[str] = Field(default=None, alias="reagentId")
    catalog_number: Optional[str] = Field(default=None, alias="catalogNumber")
    description: str
    quantity: int = Field(ge=1)
    unit: str
    purity: Optional[float] = Field(default=None, ge=0, le=100)
    grade: Optional[str] = None
    storage_required: Optional[str] = Field(default=None, alias="storageRequired")
    lot_specific: bool = Field(default=False, alias="lotSpecific")
    acceptable_substitutes: List[str] = Field(default_factory=list, alias="acceptableSubstitutes")


class RFQRequirements(BaseModel):
    """RFQ delivery and handling requirements."""
    model_config = ConfigDict(populate_by_name=True)
    
    delivery_date: date = Field(alias="deliveryDate")
    delivery_address: Address = Field(alias="deliveryAddress")
    cold_chain_required: bool = Field(default=False, alias="coldChainRequired")
    coa_required: bool = Field(default=True, alias="coaRequired")
    sds_required: bool = Field(default=True, alias="sdsRequired")
    insurance_required: bool = Field(default=False, alias="insuranceRequired")
    special_handling: List[str] = Field(default_factory=list, alias="specialHandling")


class GrantInfo(BaseModel):
    """Grant funding information."""
    model_config = ConfigDict(populate_by_name=True)
    
    grant_number: str = Field(alias="grantNumber")
    agency: GrantAgency
    pi_name: str = Field(alias="piName")
    institution: str
    compliance_required: bool = Field(default=True, alias="complianceRequired")


class QuoteItem(BaseModel):
    """Individual item in a quote."""
    model_config = ConfigDict(populate_by_name=True)
    
    rfq_item_id: str = Field(alias="rfqItemId")
    lot_id: Optional[str] = Field(default=None, alias="lotId")
    unit_price: float = Field(alias="unitPrice")
    quantity: int
    availability_date: date = Field(alias="availabilityDate")
    coa_available: bool = Field(default=True, alias="coaAvailable")


class Quote(BaseModel):
    """Supplier quote model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    rfq_id: str = Field(alias="rfqId")
    supplier_id: str = Field(alias="supplierId")
    items: List[QuoteItem]
    total_price: float = Field(alias="totalPrice")
    currency: str = "USD"
    validity_days: int = Field(alias="validityDays")
    delivery_lead_time: int = Field(alias="deliveryLeadTime")
    terms: str
    status: QuoteStatus = QuoteStatus.DRAFT
    submitted_at: Optional[datetime] = Field(default=None, alias="submittedAt")
    notes: Optional[str] = None


class RFQBase(BaseModel):
    """Base RFQ model."""
    model_config = ConfigDict(populate_by_name=True)
    
    title: str
    items: List[RFQItem]
    requirements: RFQRequirements


class RFQCreate(RFQBase):
    """RFQ creation model."""
    grant_info: Optional[GrantInfo] = Field(default=None, alias="grantInfo")
    deadline: Optional[date] = None


class RFQUpdate(BaseModel):
    """RFQ update model."""
    model_config = ConfigDict(populate_by_name=True)
    
    title: Optional[str] = None
    items: Optional[List[RFQItem]] = None
    requirements: Optional[RFQRequirements] = None
    grant_info: Optional[GrantInfo] = Field(default=None, alias="grantInfo")
    deadline: Optional[date] = None
    status: Optional[RFQStatus] = None


class RFQ(RFQBase):
    """Full RFQ model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    buyer_id: str = Field(alias="buyerId")
    status: RFQStatus = RFQStatus.DRAFT
    grant_info: Optional[GrantInfo] = Field(default=None, alias="grantInfo")
    deadline: Optional[date] = None
    quotes: List[Quote] = Field(default_factory=list)
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
