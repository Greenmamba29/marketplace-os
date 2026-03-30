"""Equipment and product models."""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class DeviceClass(str, Enum):
    """FDA device classification."""
    CLASS_I = "I"
    CLASS_II = "II"
    CLASS_III = "III"


class SterilityStatus(str, Enum):
    """Sterility status enumeration."""
    STERILE = "sterile"
    NON_STERILE = "non_sterile"
    STERILIZABLE = "sterilizable"
    SINGLE_USE = "single_use"
    REUSABLE = "reusable"


class DocumentType(str, Enum):
    """Equipment document types."""
    IFU = "IFU"
    SPECIFICATIONS = "specifications"
    SAFETY_DATA_SHEET = "safety_data_sheet"
    CLEANING_INSTRUCTIONS = "cleaning_instructions"
    STERILIZATION_INSTRUCTIONS = "sterilization_instructions"
    MAINTENANCE_MANUAL = "maintenance_manual"
    WARRANTY = "warranty"
    CERTIFICATE_OF_ANALYSIS = "certificate_of_analysis"
    REGULATORY_CERTIFICATE = "regulatory_certificate"


class FDAClearance(BaseModel):
    """FDA clearance information."""
    type: str = Field(..., pattern=r"^(510k|PMA|De Novo|Exempt)$")
    number: str
    cleared_date: datetime
    product_code: str
    indications: str
    status: str = "active"


class UDIInfo(BaseModel):
    """Unique Device Identifier information."""
    device_identifier: str
    production_identifier: Optional[str] = None
    full_udi: str
    issuing_agency: str = Field(..., pattern=r"^(GS1|HIBCC|ICCBBA)$")
    barcode_format: str = Field(..., pattern=r"^(GS1-128|GS1-DataMatrix|HIBC)$")
    human_readable: str


class GMDNInfo(BaseModel):
    """GMDN (Global Medical Device Nomenclature) information."""
    code: str
    name: str
    definition: str
    category: str


class PhysicalAttributes(BaseModel):
    """Physical product attributes."""
    dimensions: Optional[dict] = None
    weight: Optional[dict] = None
    sterility: SterilityStatus = SterilityStatus.NON_STERILE
    shelf_life: Optional[dict] = None
    storage_conditions: Optional[dict] = None


class SupplyChainInfo(BaseModel):
    """Supply chain information."""
    lot_tracking_required: bool = False
    serial_tracking_required: bool = False
    expiration_tracking_required: bool = False
    cold_chain_required: bool = False
    hazmat: bool = False
    hazmat_class: Optional[str] = None
    minimum_order_quantity: int = 1
    lead_time_days: int = 0
    available_inventory: int = 0


class GPOPricingTier(BaseModel):
    """GPO pricing tier."""
    gpo_id: str
    gpo_name: str
    tier: int = Field(..., ge=1, le=3)
    contract_price: Decimal
    contract_number: str
    effective_date: datetime
    expiration_date: datetime
    minimum_spend: Optional[Decimal] = None


class VolumeDiscount(BaseModel):
    """Volume discount tier."""
    minimum_quantity: int
    discount_percent: Decimal


class EquipmentDocument(BaseModel):
    """Equipment document."""
    id: str
    type: DocumentType
    name: str
    url: str
    version: Optional[str] = None
    uploaded_at: datetime


class Manufacturer(BaseModel):
    """Equipment manufacturer."""
    id: str
    name: str
    catalog_number: str
    website: Optional[str] = None
    support_contact: Optional[str] = None


class RegulatoryInfo(BaseModel):
    """Regulatory information."""
    fda_product_code: str
    device_class: DeviceClass
    fda_clearance: FDAClearance
    ce_marked: bool = False
    ce_certificate_number: Optional[str] = None
    iso13485: bool = False
    quality_system_regulation: bool = False


class EquipmentBase(BaseModel):
    """Base equipment model."""
    sku: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=255)
    description: str
    category_id: str
    subcategory: Optional[str] = None
    is_active: bool = True


class EquipmentCreate(EquipmentBase):
    """Equipment creation model."""
    manufacturer: Manufacturer
    regulatory: RegulatoryInfo
    udi: Optional[UDIInfo] = None
    gmdn: Optional[GMDNInfo] = None
    physical: PhysicalAttributes = Field(default_factory=PhysicalAttributes)
    supply_chain: SupplyChainInfo = Field(default_factory=SupplyChainInfo)
    pricing: dict
    images: List[str] = Field(default_factory=list)
    documents: List[EquipmentDocument] = Field(default_factory=list)


class EquipmentUpdate(BaseModel):
    """Equipment update model."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    pricing: Optional[dict] = None
    supply_chain: Optional[SupplyChainInfo] = None


class Equipment(EquipmentBase):
    """Full equipment model."""
    id: str
    manufacturer: Manufacturer
    regulatory: RegulatoryInfo
    udi: Optional[UDIInfo] = None
    gmdn: Optional[GMDNInfo] = None
    physical: PhysicalAttributes
    supply_chain: SupplyChainInfo
    pricing: dict
    images: List[str]
    documents: List[EquipmentDocument]
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class EquipmentFilter(BaseModel):
    """Equipment filter parameters."""
    category: Optional[List[str]] = None
    device_class: Optional[List[DeviceClass]] = None
    manufacturer: Optional[List[str]] = None
    cold_chain: Optional[bool] = None
    sterile: Optional[bool] = None
    in_stock: Optional[bool] = None
    price_min: Optional[Decimal] = None
    price_max: Optional[Decimal] = None
    search: Optional[str] = None


class UDIMovement(BaseModel):
    """UDI movement record."""
    timestamp: datetime
    from_location: str
    to_location: str
    performed_by: str
    reason: str


class UDITrackingInfo(BaseModel):
    """UDI tracking information."""
    udi: str
    equipment_id: str
    lot_number: Optional[str] = None
    serial_number: Optional[str] = None
    expiration_date: Optional[datetime] = None
    manufacturing_date: Optional[datetime] = None
    current_location: str
    status: str
    movements: List[UDIMovement]


class RegulatoryClearance(BaseModel):
    """Regulatory clearance record."""
    id: str
    equipment_id: str
    type: str
    number: str
    product_code: str
    device_name: str
    applicant: str
    cleared_date: datetime
    indications: str
    status: str
    recall_info: Optional[dict] = None
