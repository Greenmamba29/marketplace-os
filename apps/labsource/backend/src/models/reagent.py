"""
Reagent/Product Models for LabSource
"""

from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class ReagentCategory(str, Enum):
    """Reagent categories."""
    ANTIBODIES = "antibodies"
    CELL_CULTURE = "cell-culture"
    MOLECULAR_BIOLOGY = "molecular-biology"
    PROTEIN_BIOCHEMISTRY = "protein-biochemistry"
    ANALYTICAL_STANDARDS = "analytical-standards"
    LAB_CHEMICALS = "lab-chemicals"
    DIAGNOSTICS = "diagnostics"
    CONSUMABLES = "consumables"
    EQUIPMENT = "equipment"


class ReagentGrade(str, Enum):
    """Reagent grades."""
    RESEARCH = "research"
    ANALYTICAL = "analytical"
    MOLECULAR_BIOLOGY = "molecular-biology"
    CELL_CULTURE = "cell-culture"
    USP = "USP"
    EP = "EP"


class StorageTemp(str, Enum):
    """Storage temperature requirements."""
    RT = "RT"
    COLD = "2-8C"
    FROZEN = "-20C"
    ULTRA_LOW = "-80C"
    LN2 = "LN2"


class CLIAStatus(str, Enum):
    """CLIA status for diagnostic products."""
    WAIVED = "waived"
    MODERATE = "moderate"
    HIGH = "high"
    NONE = "none"


class Manufacturer(BaseModel):
    """Manufacturer information."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    name: str
    logo: Optional[str] = None
    iso_certified: bool = Field(alias="isoCertified")
    gmp_certified: bool = Field(alias="gmpCertified")


class Specifications(BaseModel):
    """Reagent specifications."""
    model_config = ConfigDict(populate_by_name=True)
    
    purity: Optional[float] = Field(default=None, ge=0, le=100)
    grade: ReagentGrade
    concentration: Optional[str] = None
    form: Optional[str] = None
    molecular_weight: Optional[float] = Field(default=None, alias="molecularWeight")
    molecular_formula: Optional[str] = Field(default=None, alias="molecularFormula")


class StorageRequirements(BaseModel):
    """Storage requirements for reagents."""
    model_config = ConfigDict(populate_by_name=True)
    
    temperature: StorageTemp
    temperature_range: Optional[dict] = Field(default=None, alias="temperatureRange")
    light_sensitive: bool = Field(default=False, alias="lightSensitive")
    moisture_sensitive: bool = Field(default=False, alias="moistureSensitive")
    special_conditions: List[str] = Field(default_factory=list, alias="specialConditions")


class ComplianceInfo(BaseModel):
    """Compliance information for reagents."""
    model_config = ConfigDict(populate_by_name=True)
    
    animal_free: bool = Field(default=False, alias="animalFree")
    endotoxin_level: Optional[str] = Field(default=None, alias="endotoxinLevel")
    mycoplasma_tested: Optional[bool] = Field(default=None, alias="mycoplasmaTested")
    sterile: Optional[bool] = None
    clia_status: Optional[CLIAStatus] = Field(default=None, alias="cliaStatus")
    ivd_status: Optional[bool] = Field(default=None, alias="ivdStatus")
    regulatory_status: List[str] = Field(default_factory=list, alias="regulatoryStatus")


class BulkPricingTier(BaseModel):
    """Bulk pricing tier."""
    model_config = ConfigDict(populate_by_name=True)
    
    min_quantity: int = Field(alias="minQuantity")
    max_quantity: Optional[int] = Field(default=None, alias="maxQuantity")
    price_per_unit: float = Field(alias="pricePerUnit")


class PricingInfo(BaseModel):
    """Pricing information."""
    model_config = ConfigDict(populate_by_name=True)
    
    unit_price: float = Field(alias="unitPrice")
    currency: str = "USD"
    unit_size: str = Field(alias="unitSize")
    bulk_pricing: List[BulkPricingTier] = Field(default_factory=list, alias="bulkPricing")
    educational_discount: Optional[float] = Field(default=None, alias="educationalDiscount")


class ReagentBase(BaseModel):
    """Base reagent model."""
    model_config = ConfigDict(populate_by_name=True)
    
    name: str
    description: str
    catalog_number: str = Field(alias="catalogNumber")
    cas_number: Optional[str] = Field(default=None, alias="casNumber")
    category: ReagentCategory
    subcategory: Optional[str] = None


class ReagentCreate(ReagentBase):
    """Reagent creation model."""
    manufacturer_id: str = Field(alias="manufacturerId")
    specifications: Specifications
    storage: StorageRequirements
    compliance: ComplianceInfo
    pricing: PricingInfo


class ReagentUpdate(BaseModel):
    """Reagent update model."""
    model_config = ConfigDict(populate_by_name=True)
    
    name: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[Specifications] = None
    storage: Optional[StorageRequirements] = None
    compliance: Optional[ComplianceInfo] = None
    pricing: Optional[PricingInfo] = None
    is_active: Optional[bool] = Field(default=None, alias="isActive")


class ReagentFilter(BaseModel):
    """Reagent filter parameters."""
    model_config = ConfigDict(populate_by_name=True)
    
    category: Optional[ReagentCategory] = None
    manufacturer: Optional[str] = None
    storage_temp: Optional[StorageTemp] = Field(default=None, alias="storageTemp")
    clia_status: Optional[CLIAStatus] = Field(default=None, alias="cliaStatus")
    animal_free: Optional[bool] = Field(default=None, alias="animalFree")
    min_purity: Optional[float] = Field(default=None, alias="minPurity")
    in_stock: Optional[bool] = Field(default=None, alias="inStock")
    search: Optional[str] = None


class Reagent(ReagentBase):
    """Full reagent model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    manufacturer: Manufacturer
    specifications: Specifications
    storage: StorageRequirements
    compliance: ComplianceInfo
    pricing: PricingInfo
    lot_ids: List[str] = Field(default_factory=list, alias="lotIds")
    substitute_ids: List[str] = Field(default_factory=list, alias="substituteIds")
    images: List[str] = Field(default_factory=list)
    sds_url: Optional[str] = Field(default=None, alias="sdsUrl")
    coa_template_url: Optional[str] = Field(default=None, alias="coaTemplateUrl")
    is_active: bool = Field(default=True, alias="isActive")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
