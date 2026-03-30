"""User models."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user model with common fields."""
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    company: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., pattern="^(buyer|supplier|admin)$")
    phone: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update model."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    company: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """User model as stored in database."""
    id: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserBase):
    """User response model."""
    id: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    """Token payload."""
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None
