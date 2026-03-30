"""Authentication and user models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    name: str
    organization_name: str
    organization_type: str = Field(..., pattern="^(restaurant|catering|hospitality|supplier|distributor)$")


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update model."""
    name: Optional[str] = None
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None


class User(UserBase):
    """Full user model."""
    id: str
    role: str = Field(..., pattern="^(buyer|supplier|admin)$")
    organization_id: str
    permissions: List[str] = []
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
    sub: str  # user id
    email: str
    role: str
    permissions: List[str]
    exp: Optional[datetime] = None
    iat: Optional[datetime] = None


class PasswordReset(BaseModel):
    """Password reset request."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8)
