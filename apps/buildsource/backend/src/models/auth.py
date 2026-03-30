"""Authentication and user models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from .common import Address


class UserRole(str, Enum):
    """User role enumeration."""
    
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"


class UserBase(BaseModel):
    """Base user model."""
    
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    company_name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, pattern=r"^\+?1?\d{9,15}$")
    address: Optional[Address] = None


class UserCreate(UserBase):
    """User creation model."""
    
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.BUYER


class UserUpdate(BaseModel):
    """User update model."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    company_name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, pattern=r"^\+?1?\d{9,15}$")
    address: Optional[Address] = None


class User(UserBase):
    """Full user model."""
    
    id: str
    role: UserRole
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """User response model (excludes sensitive data)."""
    
    id: str
    email: EmailStr
    name: str
    company_name: str
    role: UserRole
    phone: Optional[str] = None
    address: Optional[Address] = None
    is_active: bool
    is_verified: bool
    created_at: datetime


class LoginRequest(BaseModel):
    """Login request model."""
    
    email: EmailStr
    password: str


class TokenPayload(BaseModel):
    """JWT token payload."""
    
    sub: str  # user id
    email: str
    role: UserRole
    exp: Optional[datetime] = None
    iat: Optional[datetime] = None


class LoginResponse(BaseModel):
    """Login response model."""
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class PasswordChangeRequest(BaseModel):
    """Password change request."""
    
    old_password: str
    new_password: str = Field(..., min_length=8)


class PasswordResetRequest(BaseModel):
    """Password reset request."""
    
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation."""
    
    token: str
    new_password: str = Field(..., min_length=8)
