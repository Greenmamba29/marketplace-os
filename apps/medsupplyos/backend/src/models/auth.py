"""Authentication and user models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    """User role enumeration."""
    SYSTEM_ADMIN = "system_admin"
    HOSPITAL_ADMIN = "hospital_admin"
    DEPARTMENT_MANAGER = "department_manager"
    CLINICAL_APPROVER = "clinical_approver"
    BUYER = "buyer"
    BIOMEDICAL_ENGINEER = "biomedical_engineer"
    SUPPLIER = "supplier"


class Permission(str, Enum):
    """User permission enumeration."""
    VIEW_EQUIPMENT = "view_equipment"
    CREATE_RFQ = "create_rfq"
    APPROVE_RFQ = "approve_rfq"
    PLACE_ORDERS = "place_orders"
    MANAGE_USERS = "manage_users"
    VIEW_GPO_PRICING = "view_gpo_pricing"
    MANAGE_INVENTORY = "manage_inventory"
    ACCESS_UDI_TRACKER = "access_udi_tracker"
    ADMIN_ACCESS = "admin_access"


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role: UserRole = UserRole.BUYER
    organization_id: Optional[str] = None
    department_id: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update model."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[UserRole] = None
    organization_id: Optional[str] = None
    department_id: Optional[str] = None
    is_active: Optional[bool] = None


class User(UserBase):
    """Full user model."""
    id: str
    permissions: List[Permission] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: User


class TokenData(BaseModel):
    """Token payload data."""
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None


class PasswordReset(BaseModel):
    """Password reset request."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8)


class Organization(BaseModel):
    """Organization model."""
    id: str
    name: str
    type: str
    parent_id: Optional[str] = None
    address: dict
    contact_info: dict
    gpo_affiliations: List[str] = Field(default_factory=list)
    created_at: datetime


class Department(BaseModel):
    """Department model."""
    id: str
    name: str
    type: str
    facility_id: str
    manager_id: Optional[str] = None
    budget: Optional[float] = None
    specialties: List[str] = Field(default_factory=list)
