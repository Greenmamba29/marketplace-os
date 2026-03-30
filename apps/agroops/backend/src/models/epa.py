"""EPA registration models."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ActiveIngredientEPA(BaseModel):
    """Active ingredient in EPA registration."""
    name: str
    percentage: float


class StateRegistrationEPA(BaseModel):
    """State registration status."""
    state: str
    status: str  # registered, pending, expired, restricted
    expiration_date: Optional[datetime] = None


class EPARegistration(BaseModel):
    """EPA registration model."""
    id: str
    epa_number: str = Field(..., max_length=50)
    product_name: str
    company_name: str
    company_number: str
    
    active_ingredients: List[ActiveIngredientEPA]
    formulation_type: Optional[str] = None
    registration_type: str  # technical, manufacturing_use, end_use
    
    # State registrations
    state_registrations: List[StateRegistrationEPA]
    
    # Dates
    registration_date: datetime
    expiration_date: Optional[datetime] = None
    cancellation_date: Optional[datetime] = None
    
    # Restrictions
    restricted_use: bool = False
    restricted_states: List[str] = []
    
    # Labels
    signal_word: Optional[str] = None  # caution, warning, danger
    epa_label_url: Optional[str] = None
    
    last_updated: datetime

    class Config:
        from_attributes = True


class EPASearchParams(BaseModel):
    """EPA search parameters."""
    query: Optional[str] = None
    epa_number: Optional[str] = None
    company_name: Optional[str] = None
    active_ingredient: Optional[str] = None
    state: Optional[str] = None
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)


class EPAStateStatus(BaseModel):
    """EPA state status response."""
    epa_number: str
    product_name: str
    state: str
    status: str
    expiration_date: Optional[datetime] = None
    restrictions: List[str] = []


class EPAProductVerification(BaseModel):
    """EPA product verification response."""
    product_id: str
    product_name: str
    epa_number: str
    state: str
    is_registered: bool
    status: str
    restrictions: List[str] = []
    label_url: Optional[str] = None
    sds_url: Optional[str] = None


class PaginatedEPARegistrations(BaseModel):
    """Paginated EPA registrations response."""
    items: List[EPARegistration]
    total: int
    page: int
    per_page: int
    total_pages: int
