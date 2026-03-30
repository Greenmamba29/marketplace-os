"""
Lot Registry Models for LabSource
"""

from datetime import datetime, date
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class LotStatus(str, Enum):
    """Lot status values."""
    AVAILABLE = "available"
    RESERVED = "reserved"
    EXPIRED = "expired"
    QUARANTINED = "quarantined"
    DEPLETED = "depleted"


class TestResult(BaseModel):
    """Individual test result in CoA."""
    model_config = ConfigDict(populate_by_name=True)
    
    test_name: str = Field(alias="testName")
    specification: str
    result: str
    passed: bool
    method: Optional[str] = None


class CertificateOfAnalysis(BaseModel):
    """Certificate of Analysis model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    lot_id: str = Field(alias="lotId")
    document_url: str = Field(alias="documentUrl")
    test_results: List[TestResult] = Field(default_factory=list, alias="testResults")
    approved_by: str = Field(alias="approvedBy")
    approved_at: datetime = Field(alias="approvedAt")
    reviewed_at: datetime = Field(alias="reviewedAt")
    version: int = 1


class QCData(BaseModel):
    """Quality control data."""
    model_config = ConfigDict(populate_by_name=True)
    
    sterility_test: Optional[bool] = Field(default=None, alias="sterilityTest")
    endotoxin_test: Optional[bool] = Field(default=None, alias="endotoxinTest")
    identity_test: Optional[bool] = Field(default=None, alias="identityTest")
    potency_test: Optional[bool] = Field(default=None, alias="potencyTest")
    additional_tests: Optional[dict] = Field(default=None, alias="additionalTests")


class LotBase(BaseModel):
    """Base lot model."""
    model_config = ConfigDict(populate_by_name=True)
    
    lot_number: str = Field(alias="lotNumber")
    reagent_id: str = Field(alias="reagentId")
    quantity_available: float = Field(alias="quantityAvailable")
    quantity_unit: str = Field(alias="quantityUnit")
    manufacture_date: date = Field(alias="manufactureDate")
    expiry_date: date = Field(alias="expiryDate")


class LotCreate(LotBase):
    """Lot creation model."""
    storage_location: Optional[str] = Field(default=None, alias="storageLocation")
    quality_control: QCData = Field(default_factory=QCData, alias="qualityControl")


class LotUpdate(BaseModel):
    """Lot update model."""
    model_config = ConfigDict(populate_by_name=True)
    
    quantity_available: Optional[float] = Field(default=None, alias="quantityAvailable")
    status: Optional[LotStatus] = None
    storage_location: Optional[str] = Field(default=None, alias="storageLocation")
    quality_control: Optional[QCData] = Field(default=None, alias="qualityControl")


class LotFilter(BaseModel):
    """Lot filter parameters."""
    model_config = ConfigDict(populate_by_name=True)
    
    reagent_id: Optional[str] = Field(default=None, alias="reagentId")
    status: Optional[LotStatus] = None
    expiry_before: Optional[date] = Field(default=None, alias="expiryBefore")
    expiry_after: Optional[date] = Field(default=None, alias="expiryAfter")
    has_coa: Optional[bool] = Field(default=None, alias="hasCoa")


class Lot(LotBase):
    """Full lot model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    coa: Optional[CertificateOfAnalysis] = None
    storage_location: Optional[str] = Field(default=None, alias="storageLocation")
    status: LotStatus = LotStatus.AVAILABLE
    quality_control: QCData = Field(default_factory=QCData, alias="qualityControl")
    cold_chain_log_id: Optional[str] = Field(default=None, alias="coldChainLogId")
    created_at: datetime = Field(alias="createdAt")
    
    @property
    def is_expired(self) -> bool:
        return date.today() > self.expiry_date
    
    @property
    def days_until_expiry(self) -> int:
        return (self.expiry_date - date.today()).days


class LotExpiryAlert(BaseModel):
    """Lot expiry alert model."""
    model_config = ConfigDict(populate_by_name=True)
    
    lot_id: str = Field(alias="lotId")
    reagent_name: str = Field(alias="reagentName")
    lot_number: str = Field(alias="lotNumber")
    expiry_date: date = Field(alias="expiryDate")
    days_until_expiry: int = Field(alias="daysUntilExpiry")
    quantity_remaining: float = Field(alias="quantityRemaining")
