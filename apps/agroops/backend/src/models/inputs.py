"""Product/input models."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field

from .auth import Supplier


class InputCategory(str):
    """Input categories."""
    SEED = "seed"
    FERTILIZER = "fertilizer"
    CROP_PROTECTION = "crop_protection"
    EQUIPMENT = "equipment"
    LIVESTOCK = "livestock"
    OTHER = "other"


class FormulationType(str):
    """Formulation types."""
    EC = "EC"
    SC = "SC"
    WG = "WG"
    GRANULAR = "granular"
    LIQUID = "liquid"
    POWDER = "powder"
    PELLET = "pellet"
    OTHER = "other"


class ActiveIngredient(BaseModel):
    """Active ingredient model."""
    name: str
    percentage: float = Field(..., ge=0.0, le=100.0)


class NPKRatio(BaseModel):
    """NPK ratio for fertilizers."""
    nitrogen: float = Field(..., ge=0.0)
    phosphorus: float = Field(..., ge=0.0)
    potassium: float = Field(..., ge=0.0)


class BulkPricingTier(BaseModel):
    """Bulk pricing tier model."""
    min_quantity: float
    max_quantity: Optional[float] = None
    price_per_unit: Decimal


class StateRegistration(BaseModel):
    """State registration model."""
    state: str
    status: str  # registered, pending, expired, restricted
    expiration_date: Optional[datetime] = None


class ApplicationTiming(BaseModel):
    """Application timing model."""
    growth_stage: str
    timing_description: str
    rate_per_acre: str


class AgInputBase(BaseModel):
    """Base agricultural input model."""
    name: str = Field(..., min_length=1, max_length=200)
    category: str
    subcategory: Optional[str] = Field(None, max_length=100)
    description: str = Field(..., min_length=1, max_length=5000)
    brand: str = Field(..., min_length=1, max_length=100)
    manufacturer: str = Field(..., min_length=1, max_length=200)
    sku: str = Field(..., min_length=1, max_length=100)
    
    # Active ingredients (for crop protection)
    active_ingredients: List[ActiveIngredient] = []
    epa_registration_number: Optional[str] = Field(None, max_length=50)
    
    # Formulation
    formulation_type: Optional[str] = None
    
    # Application details
    application_timing: List[ApplicationTiming] = []
    crop_compatibility: List[str] = []
    target_pests: List[str] = []
    
    # Safety/Compliance
    phi_days: Optional[int] = None  # Pre-Harvest Interval
    rei_hours: Optional[int] = None  # Re-Entry Interval
    
    # Fertilizer specific
    npk_ratio: Optional[NPKRatio] = None
    
    # Pricing
    base_price: Decimal
    unit: str = Field(..., min_length=1, max_length=20)
    min_order_quantity: float = Field(default=1.0, ge=0.0)
    bulk_pricing: List[BulkPricingTier] = []
    
    # Media
    images: List[str] = []
    sds_url: Optional[str] = None
    label_url: Optional[str] = None


class AgInputCreate(AgInputBase):
    """Input creation model."""
    supplier_id: str


class AgInput(AgInputBase):
    """Input response model."""
    id: str
    supplier_id: str
    supplier_name: str
    state_registrations: List[StateRegistration] = []
    
    # Inventory
    stock_quantity: float = 0.0
    stock_status: str = "out_of_stock"  # in_stock, low_stock, out_of_stock
    
    # Ratings
    rating: float = Field(0.0, ge=0.0, le=5.0)
    review_count: int = 0
    
    # Status
    status: str = "pending"  # pending, approved, rejected
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AgInputFilter(BaseModel):
    """Input filter model."""
    category: Optional[List[str]] = None
    formulation_type: Optional[List[str]] = None
    crop_compatibility: Optional[List[str]] = None
    state: Optional[str] = None
    price_min: Optional[Decimal] = None
    price_max: Optional[Decimal] = None
    brand: Optional[List[str]] = None
    in_stock_only: Optional[bool] = None
    epa_registered_only: Optional[bool] = None
    search: Optional[str] = None


class PaginatedInputs(BaseModel):
    """Paginated inputs response."""
    items: List[AgInput]
    total: int
    page: int
    per_page: int
    total_pages: int
