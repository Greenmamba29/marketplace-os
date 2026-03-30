"""Authentication and user models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    """User role enumeration."""
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"
    ANALYST = "analyst"


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    company_name: str = Field(..., min_length=2, max_length=100)
    role: UserRole = UserRole.BUYER


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class User(UserBase):
    """Full user model."""
    id: str
    is_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    """JWT token payload."""
    sub: Optional[str] = None
    exp: Optional[datetime] = None
    iat: Optional[datetime] = None
    type: Optional[str] = None


class UserProfileUpdate(BaseModel):
    """User profile update model."""
    company_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    address: Optional[str] = None
