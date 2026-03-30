"""
Authentication Router for LabSource
"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..models.auth import (
    User,
    UserCreate,
    UserLogin,
    Token,
    UserUpdate,
    PasswordReset,
    PasswordResetConfirm,
)
from ..models.common import ApiResponse
from ..services.auth import AuthService, get_auth_service, AuthError

router = APIRouter()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    """Get the current authenticated user."""
    token = credentials.credentials
    try:
        payload = auth_service.decode_token(token)
        user = await auth_service.get_user_by_id(payload.sub)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is inactive",
            )
        return user
    except AuthError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get current user and verify they are an admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.post("/register", response_model=ApiResponse[Token])
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Register a new user account."""
    try:
        user = await auth_service.register_user(user_data)
        
        # Create tokens
        access_token = auth_service.create_access_token(
            user.id, user.email, user.role
        )
        refresh_token = auth_service.create_refresh_token(user.id)
        
        return ApiResponse.success_response(Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=60 * 24,  # 24 hours in minutes
            user=user,
        ))
    
    except AuthError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=ApiResponse[Token])
async def login(
    credentials: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Authenticate and get access token."""
    user = await auth_service.authenticate_user(
        credentials.email,
        credentials.password,
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Create tokens
    access_token = auth_service.create_access_token(
        user.id, user.email, user.role
    )
    refresh_token = auth_service.create_refresh_token(user.id)
    
    return ApiResponse.success_response(Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=60 * 24,
        user=user,
    ))


@router.post("/refresh", response_model=ApiResponse[dict])
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Refresh access token using refresh token."""
    try:
        refresh_token = credentials.credentials
        new_access_token = await auth_service.refresh_access_token(refresh_token)
        
        return ApiResponse.success_response({
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": 60 * 24,
        })
    
    except AuthError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.get("/me", response_model=ApiResponse[User])
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """Get current user information."""
    return ApiResponse.success_response(current_user)


@router.put("/me", response_model=ApiResponse[User])
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Update current user information."""
    # TODO: Implement user update in Baserow
    # For now, just return the current user
    return ApiResponse.success_response(current_user)


@router.post("/logout", response_model=ApiResponse[dict])
async def logout(
    current_user: User = Depends(get_current_user),
):
    """Logout user (invalidate token on client side)."""
    # JWT tokens are stateless, so we just acknowledge the logout
    # In production, you might want to add the token to a blacklist
    return ApiResponse.success_response({"message": "Successfully logged out"})


@router.post("/password-reset", response_model=ApiResponse[dict])
async def request_password_reset(
    reset_data: PasswordReset,
):
    """Request a password reset email."""
    # TODO: Implement password reset email sending
    return ApiResponse.success_response({
        "message": "If the email exists, a password reset link has been sent",
    })


@router.post("/password-reset/confirm", response_model=ApiResponse[dict])
async def confirm_password_reset(
    reset_data: PasswordResetConfirm,
):
    """Confirm password reset with token."""
    # TODO: Implement password reset confirmation
    return ApiResponse.success_response({
        "message": "Password has been reset successfully",
    })
