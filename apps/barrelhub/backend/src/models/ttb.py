"""TTB compliance and permit models."""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class TTBStatus(str, Enum):
    """TTB permit status enumeration."""
    VERIFIED = "verified"
    PENDING = "pending"
    EXPIRED = "expired"
    SUSPENDED = "suspended"


class PermitType(str, Enum):
    """TTB permit type enumeration."""
    DSP = "dsp"  # Distilled Spirits Plant
    BWG = "bwg"  # Bonded Wine Cellar
    IMPORTER = "importer"
    EXPORTER = "exporter"


class TTBPermitBase(BaseModel):
    """Base TTB permit model."""
    permit_number: str = Field(..., description="TTB permit number")
    company_name: str
    permit_type: PermitType
    status: TTBStatus
    issue_date: date
    expiration_date: Optional[date] = None
    bond_amount: Optional[Decimal] = None
    bond_surety: Optional[str] = None
    premises_address: str


class TTBPermit(TTBPermitBase):
    """Full TTB permit model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = None
    notes: Optional[str] = None


class TTBPermitVerification(BaseModel):
    """TTB permit verification response."""
    valid: bool
    permit_number: str
    company_name: Optional[str] = None
    status: Optional[str] = None
    expiration_date: Optional[date] = None
    message: Optional[str] = None


class TTBSearchResult(BaseModel):
    """TTB permit search result."""
    permit_number: str
    company_name: str
    permit_type: PermitType
    status: TTBStatus
    city: str
    state: str
