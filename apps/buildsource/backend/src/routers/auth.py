"""Authentication router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models.auth import (
    LoginRequest,
    LoginResponse,
    UserCreate,
    UserResponse,
    UserUpdate,
    PasswordChangeRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
)
from models.common import ApiResponse
from services.auth import get_auth_service
from services.baserow import get_baserow_service

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


@router.post("/login", response_model=ApiResponse[LoginResponse])
async def login(
    request: LoginRequest,
    auth_service=Depends(get_auth_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[LoginResponse]:
    """Authenticate user and return tokens."""
    user = await auth_service.authenticate_user(
        request.email,
        request.password,
        baserow.get_user_by_email,
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    access_token = auth_service.create_access_token(
        user.id,
        user.email,
        user.role,
    )
    refresh_token = auth_service.create_refresh_token(user.id)
    
    return ApiResponse.success_response(
        LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                company_name=user.company_name,
                role=user.role,
                phone=user.phone,
                address=user.address,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at,
            ),
        )
    )


@router.post("/register", response_model=ApiResponse[LoginResponse])
async def register(
    request: UserCreate,
    auth_service=Depends(get_auth_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[LoginResponse]:
    """Register a new user."""
    # Check if user exists
    existing = await baserow.get_user_by_email(request.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    user = await auth_service.register_user(
        request,
        lambda data: baserow.create_row("users", data),
    )
    
    # Create tokens
    access_token = auth_service.create_access_token(
        user.id,
        user.email,
        user.role,
    )
    refresh_token = auth_service.create_refresh_token(user.id)
    
    return ApiResponse.success_response(
        LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                company_name=user.company_name,
                role=user.role,
                phone=user.phone,
                address=user.address,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at,
            ),
        ),
        message="User registered successfully",
    )


@router.post("/refresh", response_model=ApiResponse[dict])
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service=Depends(get_auth_service),
) -> ApiResponse[dict]:
    """Refresh access token."""
    user_id = auth_service.verify_refresh_token(credentials.credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    # Get user from database (would need implementation)
    # For now, return new tokens
    new_access = auth_service.create_access_token(user_id, "", "buyer")
    new_refresh = auth_service.create_refresh_token(user_id)
    
    return ApiResponse.success_response({
        "access_token": new_access,
        "refresh_token": new_refresh,
    })


@router.post("/logout", response_model=ApiResponse[dict])
async def logout() -> ApiResponse[dict]:
    """Logout user (invalidate tokens)."""
    # In a real implementation, add token to blacklist
    return ApiResponse.success_response(
        {},
        message="Logged out successfully",
    )


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service=Depends(get_auth_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[UserResponse]:
    """Get current user profile."""
    payload = auth_service.decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    # Get user from database
    user_data = await baserow.get_row("users", payload.sub)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return ApiResponse.success_response(
        UserResponse(
            id=str(user_data.get("id")),
            email=user_data.get("email"),
            name=user_data.get("name"),
            company_name=user_data.get("company_name"),
            role=user_data.get("role"),
            phone=user_data.get("phone"),
            address=user_data.get("address"),
            is_active=user_data.get("is_active", True),
            is_verified=user_data.get("is_verified", False),
            created_at=user_data.get("created_at"),
        )
    )


@router.patch("/profile", response_model=ApiResponse[UserResponse])
async def update_profile(
    update: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service=Depends(get_auth_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[UserResponse]:
    """Update user profile."""
    payload = auth_service.decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    # Update user in database
    updated = await baserow.update_row(
        "users",
        payload.sub,
        update.model_dump(exclude_unset=True),
    )
    
    return ApiResponse.success_response(
        UserResponse(
            id=str(updated.get("id")),
            email=updated.get("email"),
            name=updated.get("name"),
            company_name=updated.get("company_name"),
            role=updated.get("role"),
            phone=updated.get("phone"),
            address=updated.get("address"),
            is_active=updated.get("is_active", True),
            is_verified=updated.get("is_verified", False),
            created_at=updated.get("created_at"),
        ),
        message="Profile updated successfully",
    )


@router.post("/change-password", response_model=ApiResponse[dict])
async def change_password(
    request: PasswordChangeRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service=Depends(get_auth_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Change user password."""
    payload = auth_service.decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    # Get user
    user_data = await baserow.get_row("users", payload.sub)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Verify old password
    if not auth_service.verify_password(
        request.old_password,
        user_data.get("password_hash", ""),
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password",
        )
    
    # Update password
    new_hash = auth_service.hash_password(request.new_password)
    await baserow.update_row("users", payload.sub, {"password_hash": new_hash})
    
    return ApiResponse.success_response(
        {},
        message="Password changed successfully",
    )


@router.post("/forgot-password", response_model=ApiResponse[dict])
async def forgot_password(
    request: PasswordResetRequest,
) -> ApiResponse[dict]:
    """Request password reset."""
    # In a real implementation, send reset email
    return ApiResponse.success_response(
        {},
        message="If the email exists, a reset link has been sent",
    )


@router.post("/reset-password", response_model=ApiResponse[dict])
async def reset_password(
    request: PasswordResetConfirm,
    auth_service=Depends(get_auth_service),
) -> ApiResponse[dict]:
    """Reset password with token."""
    # In a real implementation, verify token and update password
    return ApiResponse.success_response(
        {},
        message="Password reset successfully",
    )
