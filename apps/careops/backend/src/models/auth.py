"""Authentication and user models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    """User role enum."""

    FAMILY = "family"
    CAREGIVER = "caregiver"
    ADMIN = "admin"
    AGENCY = "agency"


class UserBase(BaseModel):
    """Base user model."""

    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserCreate(UserBase):
    """User creation model."""

    password: str = Field(..., min_length=8, max_length=100)
    role: UserRole = UserRole.FAMILY


class UserRegister(BaseModel):
    """User registration model."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    role: UserRole = UserRole.FAMILY
    phone: Optional[str] = None


class UserLogin(BaseModel):
    """User login model."""

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update model."""

    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserResponse(UserBase):
    """User response model."""

    id: str
    role: UserRole
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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
    exp: Optional[datetime] = None


class TokenRefresh(BaseModel):
    """Token refresh request model."""

    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request model."""

    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset model."""

    token: str
    new_password: str = Field(..., min_length=8)


class ChangePassword(BaseModel):
    """Change password model."""

    current_password: str
    new_password: str = Field(..., min_length=8)
