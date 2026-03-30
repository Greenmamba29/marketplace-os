"""
RFP Models for GovSource Backend
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from .common import GovernmentAgency, SET_ASIDE_TYPES, SECURITY_CLEARANCE_LEVELS, RFP_STATUSES, CONTRACT_TYPES


class FARClause(BaseModel):
    """FAR clause model."""
    number: str
    title: str
    description: str
    is_flow_down: bool = Field(default=False, alias="isFlowDown")
    applicable: bool = True

    class Config:
        populate_by_name = True


class EvaluationCriteria(BaseModel):
    """Evaluation criteria model."""
    factor: str
    weight: float = Field(..., ge=0, le=100)
    description: str


class RFPAttachment(BaseModel):
    """RFP attachment model."""
    id: str
    name: str
    type: str
    size: int
    url: str
    uploaded_at: str = Field(..., alias="uploadedAt")

    class Config:
        populate_by_name = True


class EstimatedValue(BaseModel):
    """Estimated contract value range."""
    min: float
    max: float


class PeriodOfPerformance(BaseModel):
    """Contract period details."""
    base_period: int = Field(..., alias="basePeriod")
    option_periods: int = Field(..., alias="optionPeriods")
    total_months: int = Field(..., alias="totalMonths")

    class Config:
        populate_by_name = True


class ImportantDates(BaseModel):
    """Key RFP dates."""
    issue_date: str = Field(..., alias="issueDate")
    questions_due: str = Field(..., alias="questionsDue")
    proposal_due: str = Field(..., alias="proposalDue")
    award_date: Optional[str] = Field(None, alias="awardDate")

    class Config:
        populate_by_name = True


class RFPCreate(BaseModel):
    """RFP creation model."""
    solicitation_number: str = Field(..., alias="solicitationNumber")
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1)
    agency_id: str = Field(..., alias="agencyId")
    naics_codes: List[str] = Field(..., alias="naicsCodes")
    psc_codes: List[str] = Field(default=[], alias="pscCodes")
    set_aside: Literal[tuple(SET_ASIDE_TYPES)] = "NONE"
    contract_type: Literal[tuple(CONTRACT_TYPES)] = Field(..., alias="contractType")
    estimated_value: EstimatedValue = Field(..., alias="estimatedValue")
    period_of_performance: PeriodOfPerformance = Field(..., alias="periodOfPerformance")
    security_clearance_required: Literal[tuple(SECURITY_CLEARANCE_LEVELS)] = Field(..., alias="securityClearanceRequired")
    important_dates: ImportantDates = Field(..., alias="importantDates")
    far_clauses: List[FARClause] = Field(default=[], alias="farClauses")
    evaluation_criteria: List[EvaluationCriteria] = Field(..., alias="evaluationCriteria")

    class Config:
        populate_by_name = True


class RFPUpdate(BaseModel):
    """RFP update model."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal[tuple(RFP_STATUSES)]] = None
    naics_codes: Optional[List[str]] = Field(None, alias="naicsCodes")
    psc_codes: Optional[List[str]] = Field(None, alias="pscCodes")
    set_aside: Optional[str] = Field(None, alias="setAside")
    estimated_value: Optional[EstimatedValue] = Field(None, alias="estimatedValue")
    important_dates: Optional[ImportantDates] = Field(None, alias="importantDates")
    far_clauses: Optional[List[FARClause]] = Field(None, alias="farClauses")
    evaluation_criteria: Optional[List[EvaluationCriteria]] = Field(None, alias="evaluationCriteria")

    class Config:
        populate_by_name = True


class RFP(BaseModel):
    """Complete RFP model."""
    id: str
    solicitation_number: str = Field(..., alias="solicitationNumber")
    title: str
    description: str
    agency: GovernmentAgency
    status: Literal[tuple(RFP_STATUSES)]
    naics_codes: List[str] = Field(..., alias="naicsCodes")
    psc_codes: List[str] = Field(..., alias="pscCodes")
    set_aside: str = Field(..., alias="setAside")
    contract_type: str = Field(..., alias="contractType")
    estimated_value: EstimatedValue = Field(..., alias="estimatedValue")
    period_of_performance: PeriodOfPerformance = Field(..., alias="periodOfPerformance")
    security_clearance_required: str = Field(..., alias="securityClearanceRequired")
    important_dates: ImportantDates = Field(..., alias="importantDates")
    far_clauses: List[FARClause] = Field(..., alias="farClauses")
    evaluation_criteria: List[EvaluationCriteria] = Field(..., alias="evaluationCriteria")
    attachments: List[RFPAttachment] = []
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")

    class Config:
        populate_by_name = True


class RFPFilter(BaseModel):
    """RFP filter parameters."""
    search: Optional[str] = None
    agency: Optional[str] = None
    naics_codes: Optional[List[str]] = Field(None, alias="naicsCodes")
    set_aside: Optional[str] = Field(None, alias="setAside")
    status: Optional[str] = None
    min_value: Optional[float] = Field(None, alias="minValue")
    max_value: Optional[float] = Field(None, alias="maxValue")
    security_clearance: Optional[str] = Field(None, alias="securityClearance")

    class Config:
        populate_by_name = True


class VendorMatch(BaseModel):
    """Vendor match result for RFP."""
    vendor_id: str = Field(..., alias="vendorId")
    score: float = Field(..., ge=0, le=1)
    reasons: List[str]

    class Config:
        populate_by_name = True


class RFPStats(BaseModel):
    """RFP statistics."""
    total: int
    open: int
    closed: int
    awarded: int
    by_agency: dict = Field(..., alias="byAgency")
    by_set_aside: dict = Field(..., alias="bySetAside")

    class Config:
        populate_by_name = True
