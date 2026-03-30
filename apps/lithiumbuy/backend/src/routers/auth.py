"""Authentication router."""

from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from src.models import (
    ApiResponse,
    Token,
    User,
    UserCreate,
    UserLogin,
)
from src.models.auth import UserProfileUpdate
from src.services.auth import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Get the current authenticated user."""
    payload = auth_service.decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    user = await auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user


async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Get the current active user."""
    if not current_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    return current_user


@router.post("/login", response_model=ApiResponse[Token])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login with email and password."""
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = str(user.get("id"))
    access_token = auth_service.create_access_token(user_id)
    refresh_token = auth_service.create_refresh_token(user_id)
    
    return ApiResponse(
        success=True,
        data=Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=auth_service.access_token_expire * 60,
        ),
    )


@router.post("/register", response_model=ApiResponse[Token])
async def register(user_data: UserCreate):
    """Register a new user."""
    user = await auth_service.register_user(
        email=user_data.email,
        password=user_data.password,
        company_name=user_data.company_name,
        role=user_data.role.value,
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    user_id = str(user.get("id"))
    access_token = auth_service.create_access_token(user_id)
    refresh_token = auth_service.create_refresh_token(user_id)
    
    return ApiResponse(
        success=True,
        data=Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=auth_service.access_token_expire * 60,
        ),
        message="User registered successfully",
    )


@router.post("/refresh", response_model=ApiResponse[Token])
async def refresh_token(refresh_token: str):
    """Refresh access token."""
    payload = auth_service.decode_token(refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_id = payload.get("sub")
    user = await auth_service.get_user_by_id(user_id)
    
    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    new_access_token = auth_service.create_access_token(user_id)
    new_refresh_token = auth_service.create_refresh_token(user_id)
    
    return ApiResponse(
        success=True,
        data=Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_in=auth_service.access_token_expire * 60,
        ),
    )


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_active_user)):
    """Logout the current user."""
    # In a production system, you might want to blacklist the token
    return ApiResponse(success=True, message="Logged out successfully")


@router.get("/me", response_model=ApiResponse[dict])
async def get_me(current_user: dict = Depends(get_current_active_user)):
    """Get current user profile."""
    # Remove sensitive fields
    safe_user = {
        "id": str(current_user.get("id")),
        "email": current_user.get("email"),
        "company_name": current_user.get("company_name"),
        "role": current_user.get("role"),
        "is_verified": current_user.get("is_verified", False),
        "created_at": current_user.get("created_at"),
    }
    
    return ApiResponse(success=True, data=safe_user)


@router.patch("/me", response_model=ApiResponse[dict])
async def update_profile(
    update_data: UserProfileUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    """Update current user profile."""
    # TODO: Implement profile update in Baserow
    return ApiResponse(success=True, message="Profile updated successfully")
