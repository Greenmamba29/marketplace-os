"""Chemical models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ChemicalCategory(str, Enum):
    """Chemical categories."""
    SOLVENTS = "solvents"
    REAGENTS = "reagents"
    CATALYSTS = "catalysts"
    POLYMERS = "polymers"
    INTERMEDIATES = "intermediates"
    ACTIVE_PHARMACEUTICAL_INGREDIENTS = "active_pharmaceutical_ingredients"
    FOOD_ADDITIVES = "food_additives"
    COSMETIC_INGREDIENTS = "cosmetic_ingredients"
    ELECTRONIC_CHEMICALS = "electronic_chemicals"
    AGROCHEMICALS = "agrochemicals"


class ChemicalGrade(str, Enum):
    """Chemical grades."""
    TECHNICAL = "technical"
    REAGENT = "reagent"
    ACS = "acs"
    PHARMACOPEIA = "pharmacopeia"
    FOOD = "food"
    COSMETIC = "cosmetic"
    ELECTRONIC = "electronic"
    SPECTROPHOTOMETRIC = "spectrophotometric"
    HPLC = "hplc"
    GC_MS = "gc_ms"


class ChemicalBase(BaseModel):
    """Base chemical model."""
    cas_number: str = Field(..., pattern=r"^\d{2,7}-\d{2}-\d$")
    name: str = Field(..., min_length=1, max_length=500)
    iupac_name: str = Field(..., min_length=1, max_length=1000)
    synonyms: List[str] = []
    molecular_formula: str = Field(..., min_length=1, max_length=200)
    molecular_weight: float = Field(..., gt=0)
    description: str = ""
    category: ChemicalCategory = ChemicalCategory.SOLVENTS
    grade: ChemicalGrade = ChemicalGrade.TECHNICAL
    purity_min: float = Field(0, ge=0, le=100)
    purity_max: float = Field(100, ge=0, le=100)
    flashpoint_c: Optional[float] = None
    un_hazmat_number: Optional[str] = None
    storage_conditions: str = ""
    shelf_life_months: int = Field(12, ge=0)
    sds_url: Optional[str] = None
    coa_url: Optional[str] = None
    image_url: Optional[str] = None


class ChemicalCreate(ChemicalBase):
    """Chemical creation model."""
    pass


class ChemicalUpdate(BaseModel):
    """Chemical update model."""
    name: Optional[str] = None
    iupac_name: Optional[str] = None
    synonyms: Optional[List[str]] = None
    molecular_formula: Optional[str] = None
    molecular_weight: Optional[float] = None
    description: Optional[str] = None
    category: Optional[ChemicalCategory] = None
    grade: Optional[ChemicalGrade] = None
    purity_min: Optional[float] = None
    purity_max: Optional[float] = None
    flashpoint_c: Optional[float] = None
    un_hazmat_number: Optional[str] = None
    storage_conditions: Optional[str] = None
    shelf_life_months: Optional[int] = None
    sds_url: Optional[str] = None
    coa_url: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class Chemical(ChemicalBase):
    """Chemical response model."""
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChemicalSearchResult(BaseModel):
    """Chemical search result."""
    id: str
    cas_number: str
    name: str
    iupac_name: str
    molecular_formula: str
    molecular_weight: float
    category: ChemicalCategory
    grade: ChemicalGrade
    score: float


class ChemicalFilter(BaseModel):
    """Chemical filter model."""
    query: Optional[str] = None
    cas_number: Optional[str] = None
    category: Optional[ChemicalCategory] = None
    grade: Optional[ChemicalGrade] = None
    min_purity: Optional[float] = None
    max_purity: Optional[float] = None
