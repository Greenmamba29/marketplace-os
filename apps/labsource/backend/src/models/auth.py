"""
Authentication Models for LabSource
"""

from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, ConfigDict

from .common import Address, Organization, LabCertification


class UserRole(str, Enum):
    """User roles in the system."""
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"


class UserBase(BaseModel):
    """Base user model."""
    model_config = ConfigDict(populate_by_name=True)
    
    email: EmailStr
    first_name: str = Field(alias="firstName")
    last_name: str = Field(alias="lastName")


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(min_length=8)
    organization_name: str = Field(alias="organizationName")
    organization_type: str = Field(alias="organizationType")
    role: UserRole = UserRole.BUYER


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update model."""
    model_config = ConfigDict(populate_by_name=True)
    
    first_name: Optional[str] = Field(default=None, alias="firstName")
    last_name: Optional[str] = Field(default=None, alias="lastName")
    phone: Optional[str] = None
    organization: Optional[Organization] = None


class User(UserBase):
    """Full user model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    role: UserRole
    organization: Optional[Organization] = None
    lab_certifications: List[LabCertification] = Field(default_factory=list, alias="labCertifications")
    is_active: bool = Field(default=True, alias="isActive")
    is_verified: bool = Field(default=False, alias="isVerified")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class TokenPayload(BaseModel):
    """JWT token payload."""
    model_config = ConfigDict(populate_by_name=True)
    
    sub: str  # user id
    email: str
    role: UserRole
    exp: Optional[datetime] = None
    iat: Optional[datetime] = None


class Token(BaseModel):
    """Token response model."""
    model_config = ConfigDict(populate_by_name=True)
    
    access_token: str = Field(alias="accessToken")
    refresh_token: str = Field(alias="refreshToken")
    token_type: str = Field(default="bearer", alias="tokenType")
    expires_in: int = Field(alias="expiresIn")
    user: User


class PasswordReset(BaseModel):
    """Password reset request model."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation model."""
    token: str
    new_password: str = Field(min_length=8, alias="newPassword")


class PasswordChange(BaseModel):
    """Password change model."""
    current_password: str = Field(alias="currentPassword")
    new_password: str = Field(min_length=8, alias="newPassword")
