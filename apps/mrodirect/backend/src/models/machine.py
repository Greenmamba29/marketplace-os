"""Machine/Equipment models."""

from typing import Optional, List
from pydantic import BaseModel, Field


class MachineBase(BaseModel):
    """Base machine model."""
    name: str = Field(..., min_length=1, max_length=100)
    manufacturer: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    serial_number: Optional[str] = None
    year: Optional[int] = Field(None, ge=1900, le=2100)
    location: str = Field(..., min_length=1)
    department: str = Field(..., min_length=1)


class MachineCreate(MachineBase):
    """Machine creation model."""
    compatible_parts: List[str] = Field(default_factory=list)
    manuals: List[str] = Field(default_factory=list)


class MachineUpdate(BaseModel):
    """Machine update model."""
    name: Optional[str] = None
    location: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(active|maintenance|retired)$")
    last_maintenance: Optional[str] = None
    next_maintenance: Optional[str] = None


class Machine(MachineBase):
    """Machine response model."""
    id: str
    owner_id: str
    status: str
    compatible_parts: List[str]
    manuals: List[str]
    last_maintenance: Optional[str] = None
    next_maintenance: Optional[str] = None
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class MachineSummary(BaseModel):
    """Machine summary for listings."""
    id: str
    name: str
    manufacturer: str
    model: str
    status: str
    location: str
    department: str
    compatible_parts_count: int
    next_maintenance: Optional[str] = None
