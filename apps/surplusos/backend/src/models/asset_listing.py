from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class AssetListingBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1)
    condition: str = Field(...)
    asking_price: float = Field(..., ge=0)
    current_bid: float = Field(default=0, ge=0)
    auction_end_date: str = Field(...)
    seller_id: str = Field(...)
    location: str = Field(...)
    inspection_window_date: str = Field(...)

class AssetListingCreate(AssetListingBase):
    pass

class AssetListing(AssetListingBase):
    id: str
    class Config:
        from_attributes = True
