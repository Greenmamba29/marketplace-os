"""
Regulatory compliance models
"""

from typing import Optional, List
from pydantic import BaseModel, Field

from .common import TimestampMixin


class CertificationBase(BaseModel):
    """Base certification model"""
    name: str
    type: str = Field(..., pattern="^(organic|non_gmo|kosher|halal|gras|other)$")
    issuer: str
    certificate_number: str


class CertificationCreate(CertificationBase):
    """Certification creation model"""
    issue_date: str
    expiry_date: str
    document_url: Optional[str] = None


class Certification(CertificationBase, TimestampMixin):
    """Complete certification model"""
    id: str
    ingredient_id: str
    issue_date: str
    expiry_date: str
    status: str = Field(default="active", pattern="^(active|expired|pending|revoked)$")
    document_url: Optional[str] = None
    verified: bool = False
    verified_by: Optional[str] = None
    verified_at: Optional[str] = None


class GRASStatusBase(BaseModel):
    """Base GRAS status model"""
    status: str = Field(..., pattern="^(gras|nda|pending|not_submitted)$")
    self_affirmed: bool = False


class GRASStatusCreate(GRASStatusBase):
    """GRAS status creation model"""
    fdn_number: Optional[str] = None
    notification_date: Optional[str] = None
    safety_studies_url: Optional[str] = None


class GRASStatus(GRASStatusBase):
    """Complete GRAS status model"""
    id: str
    ingredient_id: str
    fdn_number: Optional[str] = None
    notification_date: Optional[str] = None
    fda_response: Optional[str] = Field(None, pattern="^(no_questions|questions|pending|not_applicable)$")
    expert_panel_date: Optional[str] = None
    safety_studies_url: Optional[str] = None


class AllergenProfileBase(BaseModel):
    """Base allergen profile model"""
    contains_major_allergens: bool = False
    major_allergens: List[str] = []
    may_contain: List[str] = []
    processed_on_shared_equipment: bool = False
    allergen_statement: str


class AllergenProfileCreate(AllergenProfileBase):
    """Allergen profile creation model"""
    pass


class AllergenProfile(AllergenProfileBase):
    """Complete allergen profile model"""
    id: str
    ingredient_id: str
    fda_compliant: bool = True


class FunctionalClaimBase(BaseModel):
    """Base functional claim model"""
    claim: str
    claim_type: str = Field(..., pattern="^(structure_function|health_claim|nutrient_content|qualified_health)$")
    regulatory_status: str = Field(default="pending", pattern="^(approved|pending|self_substantiated|not_applicable)$")


class FunctionalClaimCreate(FunctionalClaimBase):
    """Functional claim creation model"""
    substantiation_documents: List[str] = []
    fda_notification_number: Optional[str] = None


class FunctionalClaim(FunctionalClaimBase):
    """Complete functional claim model"""
    id: str
    ingredient_id: str
    substantiation_documents: List[str] = []
    fda_notification_number: Optional[str] = None


class ComplianceDocument(BaseModel):
    """Compliance document model"""
    id: str
    ingredient_id: str
    document_type: str = Field(..., pattern="^(coa|sds|gras_notification|certification|allergen_statement|spec_sheet)$")
    file_name: str
    file_url: str
    uploaded_by: str
    uploaded_at: str
    expiry_date: Optional[str] = None
    verified: bool = False
    verified_by: Optional[str] = None
    verified_at: Optional[str] = None


class FoodDefenseDoc(BaseModel):
    """Food defense documentation model"""
    id: str
    supplier_id: str
    document_type: str = Field(..., pattern="^(fsma_compliance|food_defense_plan|intentional_adulteration|supply_chain_program)$")
    status: str = Field(..., pattern="^(compliant|pending|non_compliant|under_review)$")
    document_url: Optional[str] = None
    last_audit_date: Optional[str] = None
    next_audit_date: Optional[str] = None
    notes: Optional[str] = None
