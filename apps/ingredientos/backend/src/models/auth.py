"""
Authentication and user models
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    name: str
    company_name: str


class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., min_length=8)
    role: str = Field(default="buyer", pattern="^(buyer|supplier|admin)$")


class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str


class User(UserBase):
    """User model with all fields"""
    id: str
    role: str
    verified: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Token payload data"""
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class PasswordReset(BaseModel):
    """Password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8)
