"""Material and product models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


class MaterialType(str, Enum):
    """Material type enumeration."""
    
    CONCRETE = "concrete"
    STEEL = "steel"
    LUMBER = "lumber"
    MASONRY = "masonry"
    INSULATION = "insulation"
    ROOFING = "roofing"
    DRYWALL = "drywall"
    FLOORING = "flooring"
    ELECTRICAL = "electrical"
    PLUMBING = "plumbing"
    HVAC = "hvac"
    GLASS = "glass"
    SEALANTS = "sealants"
    REBAR = "rebar"
    AGGREGATES = "aggregates"


class UnitOfMeasure(str, Enum):
    """Unit of measure enumeration."""
    
    CY = "CY"  # Cubic Yards
    LF = "LF"  # Linear Feet
    SF = "SF"  # Square Feet
    TON = "ton"
    EA = "ea"  # Each
    BAG = "bag"
    PALLET = "pallet"
    TRUCKLOAD = "truckload"


class Certification(BaseModel):
    """Material certification."""
    
    name: str
    issuer: str
    valid_until: datetime
    document_url: str


class MaterialBase(BaseModel):
    """Base material model."""
    
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    material_type: MaterialType
    grade_specification: str
    astm_standard: Optional[str] = None
    aci_standard: Optional[str] = None
    unit_of_measure: UnitOfMeasure
    min_order_quantity: float = Field(..., gt=0)
    min_truck_load: Optional[float] = None
    delivery_lead_time_days: int = Field(..., ge=0)
    recycled_content_percent: float = Field(default=0, ge=0, le=100)
    leed_points: float = Field(default=0, ge=0)
    regional_sourcing_radius_miles: int = Field(default=50, ge=0)
    unit_price: float = Field(..., ge=0)
    is_active: bool = True


class MaterialCreate(MaterialBase):
    """Material creation model."""
    
    supplier_id: str
    images: List[str] = []
    spec_sheet_url: Optional[str] = None
    safety_data_sheet_url: Optional[str] = None
    certifications: List[Certification] = []


class MaterialUpdate(BaseModel):
    """Material update model."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    grade_specification: Optional[str] = None
    unit_price: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None


class Material(MaterialBase):
    """Full material model."""
    
    id: str
    supplier_id: str
    images: List[str] = []
    spec_sheet_url: Optional[str] = None
    safety_data_sheet_url: Optional[str] = None
    certifications: List[Certification] = []
    price_valid_until: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MaterialResponse(Material):
    """Material response with supplier info."""
    
    supplier_name: Optional[str] = None
    supplier_rating: Optional[float] = None


class MaterialFilters(BaseModel):
    """Material filter parameters."""
    
    material_type: Optional[MaterialType] = None
    search: Optional[str] = None
    zip_code: Optional[str] = None
    radius_miles: Optional[int] = Field(None, ge=0, le=500)
    min_recycled_content: Optional[float] = Field(None, ge=0, le=100)
    leed_eligible: Optional[bool] = None
    in_stock: Optional[bool] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    supplier_id: Optional[str] = None
    astm_standard: Optional[str] = None


class RegionalAvailability(BaseModel):
    """Regional availability for a material."""
    
    id: str
    material_id: str
    supplier_id: str
    zip_code: str
    city: str
    state: str
    available_quantity: float
    unit_price: float
    delivery_lead_time_days: int
    last_updated: datetime


class SpecSheet(BaseModel):
    """Material specification sheet."""
    
    id: str
    material_id: str
    document_name: str
    document_type: str  # 'astm', 'aci', 'manufacturer', 'safety', 'certification'
    standard_number: Optional[str] = None
    version: str
    file_url: str
    file_size: int
    uploaded_by: str
    uploaded_at: datetime
    is_current: bool
