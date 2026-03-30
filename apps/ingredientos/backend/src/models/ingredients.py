"""
Ingredient and supplier models
"""

from typing import Optional, List
from pydantic import BaseModel, Field

from .common import TimestampMixin


class IngredientSpecs(BaseModel):
    """Technical specifications for an ingredient"""
    brix: Optional[float] = None
    viscosity_cp: Optional[float] = None
    moisture_percent: Optional[float] = Field(None, ge=0, le=100)
    ph: Optional[float] = Field(None, ge=0, le=14)
    particle_size_mesh: Optional[int] = None
    bulk_density_g_ml: Optional[float] = None
    solubility: Optional[str] = None
    protein_content: Optional[float] = Field(None, ge=0, le=100)
    shelf_life_months: int = Field(..., ge=1)
    storage_conditions: str


class RegulatoryStatus(BaseModel):
    """Regulatory approval status"""
    us_fda_status: str = Field(..., pattern="^(approved|pending|restricted|not_applicable)$")
    eu_efsa_status: str = Field(..., pattern="^(approved|pending|restricted|not_applicable)$")
    fda_regulation_number: Optional[str] = None
    e_number: Optional[str] = None


class SupplierBase(BaseModel):
    """Base supplier model"""
    name: str
    description: str
    website: Optional[str] = None
    country: str
    contact_email: str
    contact_phone: Optional[str] = None


class SupplierCreate(SupplierBase):
    """Supplier creation model"""
    certifications: List[str] = []


class Supplier(SupplierBase, TimestampMixin):
    """Complete supplier model"""
    id: str
    certifications: List[str] = []
    years_in_business: int = 0
    verified: bool = False
    rating: float = Field(default=0.0, ge=0, le=5)
    review_count: int = 0


class IngredientBase(BaseModel):
    """Base ingredient model"""
    name: str
    description: str
    category: str
    subcategory: Optional[str] = None


class IngredientCreate(IngredientBase):
    """Ingredient creation model"""
    supplier_id: str
    price_per_kg: float = Field(..., ge=0)
    moq_kg: int = Field(..., ge=1)
    price_tier: str = Field(default="standard", pattern="^(economy|standard|premium|specialty)$")
    specifications: IngredientSpecs
    country_of_origin: str
    lot_traceable: bool = True
    coa_available: bool = True


class IngredientUpdate(BaseModel):
    """Ingredient update model"""
    name: Optional[str] = None
    description: Optional[str] = None
    price_per_kg: Optional[float] = Field(None, ge=0)
    moq_kg: Optional[int] = Field(None, ge=1)
    status: Optional[str] = Field(None, pattern="^(active|inactive|pending_approval|discontinued)$")


class Ingredient(IngredientBase, TimestampMixin):
    """Complete ingredient model"""
    id: str
    supplier: Supplier
    supplier_id: str
    price_per_kg: float
    moq_kg: int
    price_tier: str
    specifications: IngredientSpecs
    regulatory_status: RegulatoryStatus
    country_of_origin: str
    lot_traceable: bool
    coa_available: bool
    sds_url: Optional[str] = None
    coa_template_url: Optional[str] = None
    product_data_sheet_url: Optional[str] = None
    status: str = "pending_approval"
    featured: bool = False


class IngredientFilter(BaseModel):
    """Filter parameters for ingredient search"""
    category: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    certifications: Optional[List[str]] = None
    gras_status: Optional[str] = None
    allergen_free: Optional[List[str]] = None
    country_of_origin: Optional[List[str]] = None
    organic_only: Optional[bool] = None
    non_gmo_only: Optional[bool] = None
    search: Optional[str] = None
