"""Order models."""
from typing import Optional, List
from pydantic import BaseModel, Field

class OrderCreate(BaseModel):
    quote_id: str
    shipping_address: str

class Order(BaseModel):
    id: str
    buyer_id: str
    supplier_id: str
    total: float
    status: str
    created_at: str

class OrderSummary(BaseModel):
    id: str
    total: float
    status: str
    created_at: str

class OrderStatusUpdate(BaseModel):
    status: str
