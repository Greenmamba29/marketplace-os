"""Barrel and Registry models."""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class SpiritType(str, Enum):
    """Spirit type enumeration."""
    BOURBON = "bourbon"
    RYE = "rye"
    SCOTCH = "scotch"
    RUM = "rum"
    TEQUILA = "tequila"
    BRANDY = "brandy"
    OTHER = "other"


class StorageType(str, Enum):
    """Storage type enumeration."""
    NEW_CHARRED_OAK = "new_charred_oak"
    USED_BOURBON = "used_bourbon"
    USED_WINE = "used_wine"
    SHERRY_CASK = "sherry_cask"
    PORT_CASK = "port_cask"


class BarrelStatus(str, Enum):
    """Barrel status enumeration."""
    AVAILABLE = "available"
    RESERVED = "reserved"
    SOLD = "sold"
    AGING = "aging"
    BOTTLED = "bottled"


class TaxStampStatus(str, Enum):
    """Tax stamp status enumeration."""
    BONDED = "bonded"
    TAX_PAID = "tax_paid"
    IN_TRANSIT = "in_transit"
    EXPORTED = "exported"


class BarrelBase(BaseModel):
    """Base barrel model."""
    barrel_number: str = Field(..., description="Unique barrel identifier")
    spirit_type: SpiritType
    age_statement: Optional[int] = Field(None, ge=0, description="Age in years")
    entry_date: date = Field(..., description="Date barrel was filled")
    projected_bottling_date: Optional[date] = None
    mash_bill: str = Field(..., description="Grain composition")
    distillery_origin: str
    storage_type: StorageType
    proof: Decimal = Field(..., ge=0, le=200, decimal_places=2)
    volume_gallons: Decimal = Field(..., ge=0, decimal_places=2)
    volume_proof_gallons: Decimal = Field(..., ge=0, decimal_places=2)
    ttb_permit_number: str
    tax_stamp_status: TaxStampStatus = TaxStampStatus.BONDED
    warehouse_location: str
    status: BarrelStatus = BarrelStatus.AVAILABLE
    price_per_proof_gallon: Optional[Decimal] = Field(None, ge=0, decimal_places=2)


class BarrelCreate(BarrelBase):
    """Barrel creation model."""
    supplier_id: str


class BarrelUpdate(BaseModel):
    """Barrel update model."""
    age_statement: Optional[int] = None
    projected_bottling_date: Optional[date] = None
    proof: Optional[Decimal] = None
    volume_gallons: Optional[Decimal] = None
    volume_proof_gallons: Optional[Decimal] = None
    tax_stamp_status: Optional[TaxStampStatus] = None
    warehouse_location: Optional[str] = None
    status: Optional[BarrelStatus] = None
    price_per_proof_gallon: Optional[Decimal] = None


class Barrel(BarrelBase):
    """Full barrel model with IDs and timestamps."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    supplier_id: str
    supplier_name: str
    total_value: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime


class BarrelFilter(BaseModel):
    """Barrel filter parameters."""
    spirit_type: Optional[List[SpiritType]] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    proof_min: Optional[Decimal] = None
    proof_max: Optional[Decimal] = None
    price_min: Optional[Decimal] = None
    price_max: Optional[Decimal] = None
    distillery: Optional[List[str]] = None
    storage_type: Optional[List[StorageType]] = None
    status: Optional[List[BarrelStatus]] = None
    location: Optional[str] = None


# Registry Models

class SampleRecord(BaseModel):
    """Barrel sample record."""
    date: datetime
    proof: Decimal
    volume: Decimal
    sample_type: str = Field(..., description="routine, customer, or quality")
    notes: Optional[str] = None


class MovementRecord(BaseModel):
    """Barrel movement record."""
    date: datetime
    from_location: str
    to_location: str
    reason: str
    authorized_by: str


class BarrelRegistryBase(BaseModel):
    """Base barrel registry model."""
    barrel_id: str
    barrel_number: str
    fill_date: date
    original_proof: Decimal
    original_volume: Decimal
    current_proof: Decimal
    current_volume: Decimal
    angel_share_loss: Decimal = Field(default=Decimal("0"))
    warehouse_location: str
    rack_number: str
    tier_position: str


class BarrelRegistryCreate(BarrelRegistryBase):
    """Barrel registry creation model."""
    pass


class BarrelRegistry(BarrelRegistryBase):
    """Full barrel registry model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    sample_history: List[SampleRecord] = Field(default_factory=list)
    movement_history: List[MovementRecord] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class BarrelHistory(BaseModel):
    """Barrel history response."""
    samples: List[SampleRecord]
    movements: List[MovementRecord]
