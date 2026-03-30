"""User and authentication models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRole(str, Enum):
    """User role enumeration."""
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    company_name: str = Field(..., min_length=1, max_length=255)
    role: UserRole = UserRole.BUYER
    ttb_permit_number: Optional[str] = None


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update model."""
    company_name: Optional[str] = None
    ttb_permit_number: Optional[str] = None
    is_verified: Optional[bool] = None


class User(UserBase):
    """Full user model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    is_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response model."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Token payload data."""
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None


class PasswordReset(BaseModel):
    """Password reset request model."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation model."""
    token: str
    new_password: str = Field(..., min_length=8)
