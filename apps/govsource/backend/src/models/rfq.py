"""
RFQ Models for GovSource Backend
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from .common import Address, RFQ_STATUSES


class RFQLineItem(BaseModel):
    """RFQ line item model."""
    id: str
    line_number: int = Field(..., alias="lineNumber")
    description: str
    nsn: Optional[str] = None  # National Stock Number
    part_number: Optional[str] = Field(None, alias="partNumber")
    quantity: int = Field(..., ge=1)
    unit: str
    required_delivery_date: str = Field(..., alias="requiredDeliveryDate")
    specifications: Optional[str] = None

    class Config:
        populate_by_name = True


class DeliveryRequirements(BaseModel):
    """Delivery requirements model."""
    fob_destination: bool = Field(default=True, alias="fobDestination")
    shipping_address: Address = Field(..., alias="shippingAddress")
    required_date: str = Field(..., alias="requiredDate")
    partial_shipments_allowed: bool = Field(default=False, alias="partialShipmentsAllowed")

    class Config:
        populate_by_name = True


class RFQTerms(BaseModel):
    """RFQ terms model."""
    payment_terms: str = Field(default="Net 30", alias="paymentTerms")
    net_days: int = Field(default=30, alias="netDays")
    discount_terms: Optional[str] = Field(None, alias="discountTerms")
    warranty: Optional[str] = None

    class Config:
        populate_by_name = True


class LineItemQuote(BaseModel):
    """Line item quote model."""
    line_item_id: str = Field(..., alias="lineItemId")
    unit_price: float = Field(..., ge=0, alias="unitPrice")
    quantity: int = Field(..., ge=1)
    total_price: float = Field(..., ge=0, alias="totalPrice")
    delivery_days: int = Field(..., ge=0, alias="deliveryDays")
    part_number: Optional[str] = Field(None, alias="partNumber")
    notes: Optional[str] = None

    class Config:
        populate_by_name = True


class Quote(BaseModel):
    """Vendor quote model."""
    id: str
    vendor_id: str = Field(..., alias="vendorId")
    rfq_id: str = Field(..., alias="rfqId")
    status: str  # DRAFT, SUBMITTED, UNDER_EVALUATION, ACCEPTED, REJECTED, EXPIRED
    line_item_quotes: List[LineItemQuote] = Field(..., alias="lineItemQuotes")
    total_price: float = Field(..., ge=0, alias="totalPrice")
    delivery_days: int = Field(..., ge=0, alias="deliveryDays")
    validity_days: int = Field(default=30, alias="validityDays")
    technical_proposal: Optional[str] = Field(None, alias="technicalProposal")
    past_performance: Optional[str] = Field(None, alias="pastPerformance")
    submitted_at: Optional[str] = Field(None, alias="submittedAt")
    expires_at: Optional[str] = Field(None, alias="expiresAt")

    class Config:
        populate_by_name = True


class ApprovalStep(BaseModel):
    """Approval step in the workflow."""
    step: int
    role: str
    approver_id: Optional[str] = Field(None, alias="approverId")
    status: Literal["PENDING", "APPROVED", "REJECTED"]
    comments: Optional[str] = None
    actioned_at: Optional[str] = Field(None, alias="actionedAt")

    class Config:
        populate_by_name = True


class RFQCreate(BaseModel):
    """RFQ creation model."""
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1)
    agency_id: str = Field(..., alias="agencyId")
    rfp_id: Optional[str] = Field(None, alias="rfpId")
    line_items: List[RFQLineItem] = Field(..., alias="lineItems")
    delivery_requirements: DeliveryRequirements = Field(..., alias="deliveryRequirements")
    terms: RFQTerms
    invited_vendors: List[str] = Field(default=[], alias="invitedVendors")

    class Config:
        populate_by_name = True


class RFQUpdate(BaseModel):
    """RFQ update model."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal[tuple(RFQ_STATUSES)]] = None
    line_items: Optional[List[RFQLineItem]] = Field(None, alias="lineItems")
    delivery_requirements: Optional[DeliveryRequirements] = Field(None, alias="deliveryRequirements")
    terms: Optional[RFQTerms] = None
    invited_vendors: Optional[List[str]] = Field(None, alias="invitedVendors")

    class Config:
        populate_by_name = True


class RFQ(BaseModel):
    """Complete RFQ model."""
    id: str
    rfq_number: str = Field(..., alias="rfqNumber")
    title: str
    description: str
    agency_id: str = Field(..., alias="agencyId")
    rfp_id: Optional[str] = Field(None, alias="rfpId")
    status: Literal[tuple(RFQ_STATUSES)]
    line_items: List[RFQLineItem] = Field(..., alias="lineItems")
    delivery_requirements: DeliveryRequirements = Field(..., alias="deliveryRequirements")
    terms: RFQTerms
    invited_vendors: List[str] = Field(..., alias="invitedVendors")
    quotes: List[Quote] = []
    approval_chain: List[ApprovalStep] = Field(..., alias="approvalChain")
    created_by: str = Field(..., alias="createdBy")
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")

    class Config:
        populate_by_name = True


class QuoteSubmit(BaseModel):
    """Quote submission model."""
    line_item_quotes: List[LineItemQuote] = Field(..., alias="lineItemQuotes")
    total_price: float = Field(..., ge=0, alias="totalPrice")
    delivery_days: int = Field(..., ge=0, alias="deliveryDays")
    validity_days: int = Field(default=30, alias="validityDays")
    technical_proposal: Optional[str] = Field(None, alias="technicalProposal")
    past_performance: Optional[str] = Field(None, alias="pastPerformance")

    class Config:
        populate_by_name = True


class ApprovalAction(BaseModel):
    """Approval action model."""
    step: int
    comments: Optional[str] = None


class AwardAction(BaseModel):
    """Award action model."""
    quote_id: str = Field(..., alias="quoteId")
