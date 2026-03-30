"""LEED tracking models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from .materials import Material


class LEEDLevel(str, Enum):
    """LEED certification level."""
    
    CERTIFIED = "certified"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"


class DocumentationStatus(str, Enum):
    """Documentation status."""
    
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETE = "complete"


class MRCredit(BaseModel):
    """Materials & Resources credit."""
    
    credit_id: str
    credit_name: str
    points_available: int
    points_earned: int
    requirements_met: bool
    documentation_status: DocumentationStatus
    materials_contributing: List[str]


class LEEDTracking(BaseModel):
    """LEED tracking for a project."""
    
    id: str
    project_id: str
    target_level: LEEDLevel
    total_points_needed: int
    current_points: int
    mr_credit_points: int
    mr_credits: List[MRCredit]
    recycled_content_value: float
    regional_materials_value: float
    rapidly_renewable_value: float
    certified_wood_value: float
    low_emitting_materials_value: float
    last_updated: datetime


class LEEDCreditDetail(BaseModel):
    """Detailed LEED credit information."""
    
    credit_id: str
    credit_name: str
    category: str
    points_available: int
    requirements: List[str]
    documentation_needed: List[str]
    calculation_methodology: str


class LEEDMaterialContribution(BaseModel):
    """Material contribution to LEED credits."""
    
    material: Material
    leed_contribution: List[str]
    points_contributed: float


class LEEDMaterialsResponse(BaseModel):
    """Response for project LEED materials."""
    
    materials: List[LEEDMaterialContribution]
    total_contribution: float


class RecycledContentBreakdown(BaseModel):
    """Recycled content breakdown for a material."""
    
    material_name: str
    cost: float
    recycled_percentage: float
    recycled_value: float


class RecycledContentSummary(BaseModel):
    """Recycled content summary for a project."""
    
    total_materials_cost: float
    recycled_content_value: float
    recycled_content_percentage: float
    post_consumer_value: float
    pre_consumer_value: float
    materials_breakdown: List[RecycledContentBreakdown]


class RegionalMaterialBreakdown(BaseModel):
    """Regional material breakdown."""
    
    material_name: str
    cost: float
    extraction_location: str
    manufacturer_location: str
    distance_miles: float
    is_regional: bool


class RegionalMaterialsSummary(BaseModel):
    """Regional materials summary for a project."""
    
    total_materials_cost: float
    regional_materials_value: float
    regional_materials_percentage: float
    materials_breakdown: List[RegionalMaterialBreakdown]


class MRCalculationResult(BaseModel):
    """Materials & Resources calculation result."""
    
    mr_credit_1: dict  # Building Life-Cycle Impact Reduction
    mr_credit_2: dict  # Building Product Disclosure - EPDs
    mr_credit_3: dict  # Building Product Disclosure - Sourcing
    mr_credit_4: dict  # Building Product Disclosure - Ingredients
    mr_credit_5: dict  # Construction and Demolition Waste Management
    total_mr_points: int


class LEEDDocumentationRequest(BaseModel):
    """Request to generate LEED documentation."""
    
    project_id: str
    credit_ids: Optional[List[str]] = None


class LEEDDocumentationResponse(BaseModel):
    """Response for LEED documentation generation."""
    
    download_url: str
    expires_at: datetime
