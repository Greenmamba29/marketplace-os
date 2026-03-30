"""
Authentication Models for GovSource Backend
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from .common import USER_ROLES


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    first_name: str = Field(..., alias="firstName", min_length=1, max_length=100)
    last_name: str = Field(..., alias="lastName", min_length=1, max_length=100)

    class Config:
        populate_by_name = True


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8, max_length=100)
    role: Literal[tuple(USER_ROLES)] = "BUYER"
    company_name: Optional[str] = Field(None, alias="companyName")
    cage_code: Optional[str] = Field(None, alias="cageCode")

    class Config:
        populate_by_name = True


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class User(UserBase):
    """User model with ID and timestamps."""
    id: str
    role: str
    is_active: bool = True
    agency_id: Optional[str] = Field(None, alias="agencyId")
    vendor_id: Optional[str] = Field(None, alias="vendorId")
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")

    class Config:
        populate_by_name = True


class Token(BaseModel):
    """JWT token response."""
    access_token: str = Field(..., alias="accessToken")
    token_type: str = Field(default="bearer", alias="tokenType")
    expires_in: int = Field(..., alias="expiresIn")
    user: User

    class Config:
        populate_by_name = True


class TokenData(BaseModel):
    """Token payload data."""
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class PasswordReset(BaseModel):
    """Password reset request."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
