"""
CLIA (Clinical Laboratory Improvement Amendments) Models for LabSource
"""

from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class CLIAComplexity(str, Enum):
    """CLIA test complexity levels."""
    WAIVED = "waived"
    MODERATE = "moderate"
    HIGH = "high"


class CLIAProduct(BaseModel):
    """CLIA product information."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    reagent_id: str = Field(alias="reagentId")
    waived: bool
    complexity: CLIAComplexity
    fda_clearance_number: Optional[str] = Field(default=None, alias="fdaClearanceNumber")
    intended_use: str = Field(alias="intendedUse")
    limitations: List[str] = Field(default_factory=list)
    qc_requirements: Optional[str] = Field(default=None, alias="qcRequirements")
    proficiency_testing: bool = Field(default=False, alias="proficiencyTesting")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")


class CLIAValidation(BaseModel):
    """CLIA validation result."""
    model_config = ConfigDict(populate_by_name=True)
    
    valid: bool
    product_id: str = Field(alias="productId")
    lab_clia_number: str = Field(alias="labCliaNumber")
    complexity: CLIAComplexity
    message: str
    requirements: List[str] = Field(default_factory=list)
    validated_at: datetime = Field(default_factory=datetime.utcnow, alias="validatedAt")


class CLIACertificate(BaseModel):
    """CLIA certificate information."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    lab_name: str = Field(alias="labName")
    clia_number: str = Field(alias="cliaNumber")
    certificate_type: str = Field(alias="certificateType")
    address: str
    effective_date: datetime = Field(alias="effectiveDate")
    expiration_date: datetime = Field(alias="expirationDate")
    specialties: List[str] = Field(default_factory=list)
    is_active: bool = Field(default=True, alias="isActive")
