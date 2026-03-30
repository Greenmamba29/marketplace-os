"""
Vendor Models for GovSource Backend
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from .common import Address, SET_ASIDE_TYPES, SECURITY_CLEARANCE_LEVELS, SAM_STATUSES


class NAICSCode(BaseModel):
    """NAICS code model."""
    code: str = Field(..., min_length=5, max_length=6)
    description: str
    is_primary: bool = Field(default=False, alias="isPrimary")
    size_standard: str = Field(default="", alias="sizeStandard")

    class Config:
        populate_by_name = True


class PSCCode(BaseModel):
    """PSC code model."""
    code: str = Field(..., min_length=1, max_length=4)
    description: str


class SAMRegistration(BaseModel):
    """SAM.gov registration details."""
    status: Literal[tuple(SAM_STATUSES)]
    registration_date: str = Field(..., alias="registrationDate")
    expiration_date: str = Field(..., alias="expirationDate")
    last_updated: str = Field(..., alias="lastUpdated")
    sam_uei: str = Field(..., alias="samUei")
    legal_business_name: str = Field(..., alias="legalBusinessName")
    physical_address: Address = Field(..., alias="physicalAddress")
    congressional_district: str = Field(..., alias="congressionalDistrict")
    business_start_date: str = Field(..., alias="businessStartDate")
    fiscal_year_end: str = Field(..., alias="fiscalYearEnd")

    class Config:
        populate_by_name = True


class VendorQualification(BaseModel):
    """Vendor qualification record."""
    id: str
    type: str
    status: str  # QUALIFIED, PENDING, DISQUALIFIED, EXPIRED, UNDER_REVIEW
    issued_date: Optional[str] = Field(None, alias="issuedDate")
    expiration_date: Optional[str] = Field(None, alias="expirationDate")
    issuing_agency: Optional[str] = Field(None, alias="issuingAgency")
    document_url: Optional[str] = Field(None, alias="documentUrl")
    notes: Optional[str] = None

    class Config:
        populate_by_name = True


class PastPerformance(BaseModel):
    """Past performance record."""
    id: str
    contract_number: str = Field(..., alias="contractNumber")
    agency_name: str = Field(..., alias="agencyName")
    contract_value: float = Field(..., alias="contractValue")
    start_date: str = Field(..., alias="startDate")
    end_date: str = Field(..., alias="endDate")
    naics_code: str = Field(..., alias="naicsCode")
    description: str
    rating: Optional[float] = None
    cpars_available: bool = Field(default=False, alias="cparsAvailable")

    class Config:
        populate_by_name = True


class Certification(BaseModel):
    """Vendor certification."""
    id: str
    type: str
    name: str
    issuing_body: str = Field(..., alias="issuingBody")
    issue_date: str = Field(..., alias="issueDate")
    expiration_date: str = Field(..., alias="expirationDate")
    document_url: Optional[str] = Field(None, alias="documentUrl")

    class Config:
        populate_by_name = True


class VendorContactInfo(BaseModel):
    """Vendor contact information."""
    primary_contact: str = Field(..., alias="primaryContact")
    phone: str
    email: str
    website: Optional[str] = None
    business_address: Address = Field(..., alias="businessAddress")

    class Config:
        populate_by_name = True


class VendorFinancialInfo(BaseModel):
    """Vendor financial information."""
    annual_revenue: Optional[float] = Field(None, alias="annualRevenue")
    number_of_employees: Optional[int] = Field(None, alias="numberOfEmployees")
    is_small_business: bool = Field(default=True, alias="isSmallBusiness")
    business_type: List[str] = Field(default=[], alias="businessType")

    class Config:
        populate_by_name = True


class ComplianceStatus(BaseModel):
    """Vendor compliance status."""
    overall_status: str = Field(..., alias="overallStatus")  # COMPLIANT, NON_COMPLIANT, UNDER_REVIEW
    far_compliance: bool = Field(default=False, alias="farCompliance")
    dfars_compliance: bool = Field(default=False, alias="dfarsCompliance")
    debarred: bool = False
    suspended: bool = False
    last_checked: str = Field(..., alias="lastChecked")

    class Config:
        populate_by_name = True


class VendorBase(BaseModel):
    """Base vendor model."""
    company_name: str = Field(..., alias="companyName", min_length=1, max_length=200)
    dba_name: Optional[str] = Field(None, alias="dbaName")
    cage_code: str = Field(..., alias="cageCode", min_length=5, max_length=5)
    uei: Optional[str] = Field(None, min_length=12, max_length=12)

    class Config:
        populate_by_name = True


class VendorCreate(VendorBase):
    """Vendor creation model."""
    user_id: str = Field(..., alias="userId")
    naics_codes: List[NAICSCode] = Field(default=[], alias="naicsCodes")
    psc_codes: List[PSCCode] = Field(default=[], alias="pscCodes")
    set_asides: List[str] = Field(default=[], alias="setAsides")
    contact_info: VendorContactInfo = Field(..., alias="contactInfo")

    class Config:
        populate_by_name = True


class VendorUpdate(BaseModel):
    """Vendor update model."""
    company_name: Optional[str] = Field(None, alias="companyName")
    dba_name: Optional[str] = Field(None, alias="dbaName")
    naics_codes: Optional[List[NAICSCode]] = Field(None, alias="naicsCodes")
    psc_codes: Optional[List[PSCCode]] = Field(None, alias="pscCodes")
    set_asides: Optional[List[str]] = Field(None, alias="setAsides")
    security_clearance: Optional[str] = Field(None, alias="securityClearance")
    contact_info: Optional[VendorContactInfo] = Field(None, alias="contactInfo")
    financial_info: Optional[VendorFinancialInfo] = Field(None, alias="financialInfo")

    class Config:
        populate_by_name = True


class Vendor(VendorBase):
    """Complete vendor model."""
    id: str
    user_id: str = Field(..., alias="userId")
    sam_registration: SAMRegistration = Field(..., alias="samRegistration")
    naics_codes: List[NAICSCode] = Field(..., alias="naicsCodes")
    psc_codes: List[PSCCode] = Field(..., alias="pscCodes")
    set_asides: List[str] = Field(..., alias="setAsides")
    security_clearance: Optional[str] = Field(None, alias="securityClearance")
    clearance_expiration: Optional[str] = Field(None, alias="clearanceExpiration")
    qualifications: List[VendorQualification] = []
    past_performance: List[PastPerformance] = Field(..., alias="pastPerformance")
    certifications: List[Certification] = []
    contact_info: VendorContactInfo = Field(..., alias="contactInfo")
    financial_info: VendorFinancialInfo = Field(..., alias="financialInfo")
    compliance_status: ComplianceStatus = Field(..., alias="complianceStatus")
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")

    class Config:
        populate_by_name = True


class VendorFilter(BaseModel):
    """Vendor filter parameters."""
    search: Optional[str] = None
    naics_codes: Optional[List[str]] = Field(None, alias="naicsCodes")
    psc_codes: Optional[List[str]] = Field(None, alias="pscCodes")
    set_asides: Optional[List[str]] = Field(None, alias="setAsides")
    security_clearance: Optional[str] = Field(None, alias="securityClearance")
    sam_status: Optional[str] = Field(None, alias="samStatus")
    state: Optional[str] = None
    small_business: Optional[bool] = Field(None, alias="smallBusiness")
    qualified_only: Optional[bool] = Field(None, alias="qualifiedOnly")

    class Config:
        populate_by_name = True
