"""
Order Models for LabSource
"""

from datetime import datetime, date
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict

from .common import Address


class OrderStatus(str, Enum):
    """Order status values."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    READY_TO_SHIP = "ready-to-ship"
    IN_TRANSIT = "in-transit"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on-hold"


class PaymentMethod(str, Enum):
    """Payment methods."""
    PURCHASE_ORDER = "purchase-order"
    CREDIT_CARD = "credit-card"
    WIRE_TRANSFER = "wire-transfer"
    GRANT_FUND = "grant-fund"


class PaymentStatus(str, Enum):
    """Payment status values."""
    PENDING = "pending"
    AUTHORIZED = "authorized"
    PAID = "paid"
    FAILED = "failed"


class ComplianceDocType(str, Enum):
    """Compliance document types."""
    COA = "coa"
    SDS = "sds"
    COC = "coc"
    INSURANCE = "insurance"
    EXPORT_LICENSE = "export-license"
    CUSTOMS_DOC = "customs-doc"


class OrderItem(BaseModel):
    """Individual item in an order."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    reagent_id: str = Field(alias="reagentId")
    lot_id: str = Field(alias="lotId")
    quantity: int
    unit_price: float = Field(alias="unitPrice")
    coa_url: Optional[str] = Field(default=None, alias="coaUrl")


class ShippingInfo(BaseModel):
    """Shipping information."""
    model_config = ConfigDict(populate_by_name=True)
    
    carrier: str
    tracking_number: Optional[str] = Field(default=None, alias="trackingNumber")
    estimated_delivery: date = Field(alias="estimatedDelivery")
    actual_delivery: Optional[date] = Field(default=None, alias="actualDelivery")
    cold_chain_log_id: Optional[str] = Field(default=None, alias="coldChainLogId")
    address: Address


class PaymentInfo(BaseModel):
    """Payment information."""
    model_config = ConfigDict(populate_by_name=True)
    
    method: PaymentMethod
    po_number: Optional[str] = Field(default=None, alias="poNumber")
    terms: str
    amount: float
    currency: str = "USD"
    status: PaymentStatus = PaymentStatus.PENDING


class ComplianceDocument(BaseModel):
    """Compliance document model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    type: ComplianceDocType
    document_url: str = Field(alias="documentUrl")
    uploaded_at: datetime = Field(alias="uploadedAt")
    valid_until: Optional[date] = Field(default=None, alias="validUntil")


class OrderBase(BaseModel):
    """Base order model."""
    model_config = ConfigDict(populate_by_name=True)
    
    items: List[OrderItem]
    shipping: ShippingInfo
    payment: PaymentInfo


class OrderCreate(OrderBase):
    """Order creation model."""
    quote_id: str = Field(alias="quoteId")
    grant_link: Optional[dict] = Field(default=None, alias="grantLink")


class OrderUpdate(BaseModel):
    """Order update model."""
    model_config = ConfigDict(populate_by_name=True)
    
    status: Optional[OrderStatus] = None
    shipping: Optional[ShippingInfo] = None
    payment: Optional[PaymentInfo] = None
    compliance_docs: Optional[List[ComplianceDocument]] = Field(default=None, alias="complianceDocs")


class Order(OrderBase):
    """Full order model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    quote_id: str = Field(alias="quoteId")
    buyer_id: str = Field(alias="buyerId")
    supplier_id: str = Field(alias="supplierId")
    status: OrderStatus = OrderStatus.PENDING
    grant_link: Optional[dict] = Field(default=None, alias="grantLink")
    compliance_docs: List[ComplianceDocument] = Field(default_factory=list, alias="complianceDocs")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
