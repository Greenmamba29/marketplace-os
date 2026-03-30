"""Compliance models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class REACHStatus(str, Enum):
    """REACH registration statuses."""
    REGISTERED = "registered"
    PRE_REGISTERED = "pre_registered"
    EXEMPT = "exempt"
    NOT_REQUIRED = "not_required"
    PENDING = "pending"


class TSCAStatus(str, Enum):
    """TSCA listing statuses."""
    LISTED = "listed"
    EXEMPT = "exempt"
    SNUR = "snur"
    PMN = "pmn"
    NOT_LISTED = "not_listed"


class EPAStatus(str, Enum):
    """EPA approval statuses."""
    APPROVED = "approved"
    RESTRICTED = "restricted"
    BANNED = "banned"
    UNDER_REVIEW = "under_review"


class RegulationType(str, Enum):
    """Regulation types."""
    REACH = "reach"
    TSCA = "tsca"
    EPA = "epa"
    FDA = "fda"
    GLOBAL = "global"


class ComplianceDocument(BaseModel):
    """Compliance document model."""
    id: str
    type: str  # sds, coa, reach_dossier, tsca_certificate, safety_assessment
    name: str
    url: str
    expiry_date: Optional[datetime] = None
    uploaded_at: datetime


class ComplianceRecordBase(BaseModel):
    """Base compliance record model."""
    cas_number: str = Field(..., pattern=r"^\d{2,7}-\d{2}-\d$")
    reach_status: REACHStatus = REACHStatus.PENDING
    reach_registration_number: Optional[str] = None
    tsca_status: TSCAStatus = TSCAStatus.NOT_LISTED
    epa_status: EPAStatus = EPAStatus.UNDER_REVIEW
    ghs_classification: List[str] = []
    hazard_codes: List[str] = []
    precautionary_statements: List[str] = []
    next_review_date: Optional[datetime] = None


class ComplianceRecordCreate(ComplianceRecordBase):
    """Compliance record creation model."""
    pass


class ComplianceRecord(ComplianceRecordBase):
    """Compliance record response model."""
    id: str
    documents: List[ComplianceDocument] = []
    last_updated: datetime

    class Config:
        from_attributes = True


class RegulatoryAlert(BaseModel):
    """Regulatory alert model."""
    id: str
    regulation_type: RegulationType
    cas_numbers: List[str]
    title: str
    description: str
    effective_date: Optional[datetime] = None
    source_url: Optional[str] = None
    severity: str  # info, low, medium, high, critical
    affected_chemicals_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class ComplianceReportType(str, Enum):
    """Compliance report types."""
    FULL_ASSESSMENT = "full_assessment"
    REACH_SUMMARY = "reach_summary"
    TSCA_CHECK = "tsca_check"
    SAFETY_REVIEW = "safety_review"


class RiskLevel(str, Enum):
    """Risk levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class ComplianceReport(BaseModel):
    """Compliance report model."""
    id: str
    cas_number: str
    chemical_name: str
    report_type: ComplianceReportType
    generated_by: str  # ai, manual
    content: str
    key_findings: List[str]
    risk_level: RiskLevel
    recommendations: List[str]
    valid_until: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class ComplianceReportRequest(BaseModel):
    """Compliance report request."""
    cas_number: str
    report_type: ComplianceReportType = ComplianceReportType.FULL_ASSESSMENT


class RiskAnalysisResponse(BaseModel):
    """Risk analysis response."""
    risk_level: RiskLevel
    factors: List[str]
    recommendations: List[str]


class RegionalComparison(BaseModel):
    """Regional compliance comparison."""
    region: str
    status: str
    notes: str


class RegionalComparisonResponse(BaseModel):
    """Regional comparison response."""
    regions: List[RegionalComparison]
