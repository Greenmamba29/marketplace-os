"""Project and project material models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from .common import Address
from .materials import Material


class ProjectType(str, Enum):
    """Project type enumeration."""
    
    COMMERCIAL = "commercial"
    RESIDENTIAL = "residential"
    INDUSTRIAL = "industrial"
    INFRASTRUCTURE = "infrastructure"
    MIXED_USE = "mixed_use"


class ConstructionType(str, Enum):
    """Construction type enumeration."""
    
    NEW = "new"
    RENOVATION = "renovation"
    EXPANSION = "expansion"


class ProjectStatus(str, Enum):
    """Project status enumeration."""
    
    PLANNING = "planning"
    PROCUREMENT = "procurement"
    CONSTRUCTION = "construction"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"


class LEEDLevel(str, Enum):
    """LEED certification level."""
    
    CERTIFIED = "certified"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"


class ProjectMaterialStatus(str, Enum):
    """Project material status."""
    
    NEEDED = "needed"
    RFQ_SENT = "rfq_sent"
    QUOTED = "quoted"
    ORDERED = "ordered"
    DELIVERED = "delivered"


class ProjectMaterialBase(BaseModel):
    """Base project material model."""
    
    quantity_required: float = Field(..., gt=0)
    delivery_date_required: datetime
    delivery_location: Optional[str] = None
    notes: Optional[str] = None


class ProjectMaterialCreate(ProjectMaterialBase):
    """Project material creation model."""
    
    material_id: str


class ProjectMaterial(ProjectMaterialBase):
    """Full project material model."""
    
    id: str
    project_id: str
    material_id: str
    material: Optional[Material] = None
    quantity_ordered: float = 0
    status: ProjectMaterialStatus = ProjectMaterialStatus.NEEDED
    leed_contribution: Optional[float] = None
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """Base project model."""
    
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    project_number: str = Field(..., min_length=1, max_length=100)
    owner_name: str = Field(..., min_length=1)
    gc_name: Optional[str] = None
    project_type: ProjectType
    construction_type: ConstructionType
    address: Address
    site_coordinates: Optional[dict] = None  # {lat: float, lng: float}
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    contract_value: Optional[float] = Field(None, ge=0)
    leed_target: Optional[LEEDLevel] = None


class ProjectCreate(ProjectBase):
    """Project creation model."""
    
    pass


class ProjectUpdate(BaseModel):
    """Project update model."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    contract_value: Optional[float] = Field(None, ge=0)
    leed_target: Optional[LEEDLevel] = None


class Project(ProjectBase):
    """Full project model."""
    
    id: str
    buyer_id: str
    status: ProjectStatus
    materials_needed: List[ProjectMaterial] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectResponse(Project):
    """Project response with additional computed fields."""
    
    materials_count: int = 0
    materials_sourced: int = 0
    budget_used: float = 0
    total_budget: float = 0


class ProjectStats(BaseModel):
    """Project statistics."""
    
    total_materials: int
    materials_sourced: int
    total_budget: float
    spent_to_date: float
    leed_points_contribution: float
    recycled_content_avg: float


class ProjectTimelineEvent(BaseModel):
    """Project timeline event."""
    
    date: datetime
    material_name: str
    quantity: float
    supplier_name: str
    status: str


class ProjectTimeline(BaseModel):
    """Project delivery timeline."""
    
    deliveries: List[ProjectTimelineEvent]
