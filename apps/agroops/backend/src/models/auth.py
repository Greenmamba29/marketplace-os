"""Authentication and user models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    """User roles."""
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    company_name: Optional[str] = Field(None, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    state: str = Field(..., min_length=2, max_length=2)


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8, max_length=100)
    role: UserRole = UserRole.BUYER


class UserUpdate(BaseModel):
    """User update model."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    company_name: Optional[str] = Field(None, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    state: Optional[str] = Field(None, min_length=2, max_length=2)


class User(UserBase):
    """User response model."""
    id: str
    role: UserRole
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserInDB(User):
    """User model with hashed password."""
    hashed_password: str


class Token(BaseModel):
    """Token response model."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    """Token payload model."""
    sub: Optional[str] = None
    exp: Optional[datetime] = None
    type: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request model."""
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    """Password reset request model."""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset model."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)


class SupplierBase(BaseModel):
    """Base supplier model."""
    company_name: str = Field(..., min_length=1, max_length=200)
    contact_name: str = Field(..., min_length=1, max_length=100)
    contact_email: EmailStr
    contact_phone: Optional[str] = Field(None, max_length=20)
    address: str = Field(..., min_length=1, max_length=500)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=2, max_length=2)
    zip_code: str = Field(..., min_length=5, max_length=10)
    website: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)


class SupplierCreate(SupplierBase):
    """Supplier creation model."""
    user_id: str


class Supplier(SupplierBase):
    """Supplier response model."""
    id: str
    user_id: str
    status: str = "pending"  # pending, verified, suspended
    rating: float = Field(0.0, ge=0.0, le=5.0)
    review_count: int = 0
    product_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SupplierVerification(BaseModel):
    """Supplier verification model."""
    supplier_id: str
    verified: bool
    notes: Optional[str] = None
