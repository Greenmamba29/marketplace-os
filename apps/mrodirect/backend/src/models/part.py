"""Part/Product models."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class Dimensions(BaseModel):
    """Product dimensions."""
    length: float = Field(..., ge=0)
    width: float = Field(..., ge=0)
    height: float = Field(..., ge=0)


class MachineCompatibility(BaseModel):
    """Machine compatibility information."""
    machine_id: str
    machine_name: str
    manufacturer: str
    model: str
    position: str
    notes: Optional[str] = None


class PartBase(BaseModel):
    """Base part model."""
    sku: str = Field(..., min_length=1, max_length=50)
    manufacturer_part_number: str = Field(..., min_length=1, max_length=100)
    manufacturer: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: str = Field(..., min_length=1)
    subcategory: Optional[str] = None
    specifications: Dict[str, Any] = Field(default_factory=dict)
    images: List[str] = Field(default_factory=list)
    msrp: float = Field(..., ge=0)
    unit: str = Field(default="each")
    weight_kg: Optional[float] = Field(None, ge=0)
    dimensions: Optional[Dimensions] = None
    country_of_origin: Optional[str] = None
    lead_time_days: int = Field(default=7, ge=0)
    is_hazmat: bool = False
    is_active: bool = True


class PartCreate(PartBase):
    """Part creation model."""
    compatible_machines: List[MachineCompatibility] = Field(default_factory=list)
    substitute_parts: List[str] = Field(default_factory=list)


class PartUpdate(BaseModel):
    """Part update model."""
    name: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    images: Optional[List[str]] = None
    msrp: Optional[float] = Field(None, ge=0)
    lead_time_days: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class Part(PartBase):
    """Part response model."""
    id: str
    compatible_machines: List[MachineCompatibility] = Field(default_factory=list)
    substitute_parts: List[str] = Field(default_factory=list)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        from_attributes = True


class SupplierPart(BaseModel):
    """Supplier offering for a part."""
    id: str
    part_id: str
    supplier_id: str
    supplier_name: str
    supplier_sku: str
    price: float = Field(..., ge=0)
    moq: int = Field(default=1, ge=1)
    stock_quantity: int = Field(default=0, ge=0)
    stock_location: Optional[str] = None
    lead_time_days: int = Field(default=7, ge=0)
    warranty_months: int = Field(default=12, ge=0)
    is_authorized: bool = False
    rating: float = Field(default=0, ge=0, le=5)
    
    class Config:
        from_attributes = True


class PartSearchResult(BaseModel):
    """Part search result with supplier info."""
    part: Part
    suppliers: List[SupplierPart]
    lowest_price: Optional[float] = None
    best_lead_time: Optional[int] = None


class PartSearchFilters(BaseModel):
    """Part search filters."""
    category: Optional[str] = None
    manufacturer: Optional[List[str]] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    in_stock: Optional[bool] = None
    lead_time_max: Optional[int] = None
    certification: Optional[List[str]] = None


class SubstituteRecommendation(BaseModel):
    """AI substitute recommendation."""
    original_part_id: str
    original_part_name: str
    substitute_part_id: str
    substitute_part_name: str
    substitute_manufacturer: str
    confidence: float = Field(..., ge=0, le=100)
    price_difference: float
    lead_time_difference: int
    compatibility_notes: str
