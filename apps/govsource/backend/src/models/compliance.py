"""
Compliance Models for GovSource Backend
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class FARCompliance(BaseModel):
    """FAR compliance record."""
    id: str
    vendor_id: str = Field(..., alias="vendorId")
    clause_number: str = Field(..., alias="clauseNumber")
    clause_title: str = Field(..., alias="clauseTitle")
    applicable: bool = True
    certified: bool = False
    certification_date: Optional[str] = Field(None, alias="certificationDate")
    expiration_date: Optional[str] = Field(None, alias="expirationDate")
    document_url: Optional[str] = Field(None, alias="documentUrl")
    notes: Optional[str] = None

    class Config:
        populate_by_name = True


class DFARSCompliance(BaseModel):
    """DFARS compliance record."""
    id: str
    vendor_id: str = Field(..., alias="vendorId")
    clause_number: str = Field(..., alias="clauseNumber")
    clause_title: str = Field(..., alias="clauseTitle")
    applicable: bool = True
    certified: bool = False
    certification_date: Optional[str] = Field(None, alias="certificationDate")
    expiration_date: Optional[str] = Field(None, alias="expirationDate")
    document_url: Optional[str] = Field(None, alias="documentUrl")
    cyber_compliance_level: Optional[str] = Field(None, alias="cyberComplianceLevel")

    class Config:
        populate_by_name = True


class ComplianceRecord(BaseModel):
    """General compliance record."""
    id: str
    vendor_id: str = Field(..., alias="vendorId")
    type: str  # FAR, DFARS, AGENCY_SPECIFIC
    requirement: str
    status: str  # COMPLIANT, NON_COMPLIANT, PENDING, WAIVED
    verified_by: Optional[str] = Field(None, alias="verifiedBy")
    verified_at: Optional[str] = Field(None, alias="verifiedAt")
    notes: Optional[str] = None
    documents: List[str] = []

    class Config:
        populate_by_name = True


class SetAsideTracking(BaseModel):
    """Set-aside eligibility tracking."""
    id: str
    vendor_id: str = Field(..., alias="vendorId")
    set_aside_type: str = Field(..., alias="setAsideType")
    certified: bool = False
    certification_body: Optional[str] = Field(None, alias="certificationBody")
    certification_date: Optional[str] = Field(None, alias="certificationDate")
    expiration_date: Optional[str] = Field(None, alias="expirationDate")
    document_url: Optional[str] = Field(None, alias="documentUrl")
    sba_profile_url: Optional[str] = Field(None, alias="sbaProfileUrl")
    verification_status: str = Field(default="PENDING", alias="verificationStatus")  # VERIFIED, PENDING, EXPIRED

    class Config:
        populate_by_name = True


class ComplianceStats(BaseModel):
    """Compliance statistics."""
    total_vendors: int = Field(..., alias="totalVendors")
    compliant_vendors: int = Field(..., alias="compliantVendors")
    non_compliant_vendors: int = Field(..., alias="nonCompliantVendors")
    pending_reviews: int = Field(..., alias="pendingReviews")
    far_clauses_tracked: int = Field(..., alias="farClausesTracked")
    dfars_clauses_tracked: int = Field(..., alias="dfarsClausesTracked")

    class Config:
        populate_by_name = True


class ExclusionRecord(BaseModel):
    """SAM.gov exclusion record."""
    name: str
    type: str  # Debarment, Suspension, etc.
    effective_date: str = Field(..., alias="effectiveDate")
    termination_date: Optional[str] = Field(None, alias="terminationDate")

    class Config:
        populate_by_name = True


class DebarredCheckResult(BaseModel):
    """Debarred check result."""
    is_debarred: bool = Field(..., alias="isDebarred")
    is_suspended: bool = Field(..., alias="isSuspended")
    matches: List[ExclusionRecord]

    class Config:
        populate_by_name = True


class ComplianceCertify(BaseModel):
    """Compliance certification request."""
    vendor_id: str = Field(..., alias="vendorId")
    type: str  # FAR, DFARS
    clause_number: str = Field(..., alias="clauseNumber")
    document_url: Optional[str] = Field(None, alias="documentUrl")

    class Config:
        populate_by_name = True
