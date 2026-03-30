"""RFQ models."""
from typing import Optional, List
from pydantic import BaseModel, Field

class RFQItem(BaseModel):
    part_id: str
    quantity: int = Field(..., ge=1)
    target_price: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None

class RFQCreate(BaseModel):
    title: str
    items: List[RFQItem]
    delivery_location: str
    required_delivery_date: str

class RFQSubmission(BaseModel):
    id: str
    buyer_id: str
    title: str
    status: str
    created_at: str
