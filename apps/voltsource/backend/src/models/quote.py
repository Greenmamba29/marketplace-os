"""Quote models."""
from typing import Optional, List
from pydantic import BaseModel, Field

class QuoteItem(BaseModel):
    rfq_item_id: str
    unit_price: float
    lead_time_days: int

class QuoteCreate(BaseModel):
    rfq_id: str
    items: List[QuoteItem]

class Quote(BaseModel):
    id: str
    rfq_id: str
    supplier_id: str
    total: float
    status: str
