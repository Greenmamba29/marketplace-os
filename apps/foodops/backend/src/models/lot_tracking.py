"""Lot tracking models for FSMA compliance."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class LotRecordBase(BaseModel):
    """Base lot record model."""
    lot_number: str
    quantity_received: float = Field(..., gt=0)
    quantity_remaining: float = Field(..., ge=0)
    unit_of_measure: str
    production_date: datetime
    received_date: datetime
    expiry_date: datetime
    temperature_at_receipt: float
    temperature_zone: str = Field(..., pattern="^(frozen|refrigerated|ambient)$")
    po_number: Optional[str] = None
    invoice_number: Optional[str] = None
    traceability_lot_code: Optional[str] = None
    kill_step_applied: bool = False


class LotRecordCreate(LotRecordBase):
    """Lot record creation model."""
    ingredient_id: str
    supplier_id: str


class LotRecordUpdate(BaseModel):
    """Lot record update model."""
    quantity_remaining: Optional[float] = None
    status: Optional[str] = Field(None, pattern="^(in_stock|in_use|expired|recalled|depleted)$")


class LotRecord(LotRecordBase):
    """Full lot record model."""
    id: str
    ingredient_id: str
    ingredient_name: str
    supplier_id: str
    supplier_name: str
    status: str = "in_stock"
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LotTraceabilityChain(BaseModel):
    """Lot traceability chain for FSMA."""
    lot_id: str
    lot_number: str
    ingredient_name: str
    production: dict
    receipt: dict
    current_status: dict
    documents: list
