"""Authentication routes."""

from datetime import datetime, timezone
from typing import Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Header, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..models.auth import (
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
    PasswordResetRequest,
    PasswordReset,
    ChangePassword,
    TokenRefresh,
)
from ..models.common import ApiResponse, ErrorResponse
from ..services.auth import AuthService
from ..services.baserow import BaserowService

logger = structlog.get_logger()
router = APIRouter()
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """Get the current authenticated user."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    auth_service = AuthService()
    token_data = auth_service.verify_token(credentials.credentials)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch user from database
    baserow = BaserowService()
    user = await baserow.get_user(token_data.user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


async def get_current_admin(
    user: dict = Depends(get_current_user),
) -> dict:
    """Get the current admin user."""
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


@router.post("/register", response_model=ApiResponse)
async def register(user_data: UserRegister):
    """Register a new user."""
    auth_service = AuthService()
    baserow = BaserowService()

    # Check if user already exists
    existing_user = await baserow.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash password
    hashed_password = auth_service.hash_password(user_data.password)

    # Create user
    user_dict = {
        "email": user_data.email,
        "password_hash": hashed_password,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "role": user_data.role.value,
        "phone": user_data.phone,
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    try:
        created_user = await baserow.create_user(user_dict)

        # Create tokens
        access_token = auth_service.create_access_token(
            user_id=created_user["id"],
            email=created_user["email"],
            role=user_data.role,
        )
        refresh_token = auth_service.create_refresh_token(user_id=created_user["id"])

        logger.info("user_registered", user_id=created_user["id"], email=user_data.email)

        return ApiResponse(
            success=True,
            message="User registered successfully",
            data={
                "user": {
                    "id": created_user["id"],
                    "email": created_user["email"],
                    "first_name": created_user["first_name"],
                    "last_name": created_user["last_name"],
                    "role": created_user["role"],
                },
                "token": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "token_type": "bearer",
                    "expires_in": 86400,  # 24 hours
                },
            },
        )

    except Exception as e:
        logger.error("registration_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )


@router.post("/login", response_model=ApiResponse)
async def login(credentials: UserLogin):
    """Login user and return tokens."""
    auth_service = AuthService()
    baserow = BaserowService()

    # Find user by email
    user = await baserow.get_user_by_email(credentials.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not auth_service.verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create tokens
    from ..models.auth import UserRole

    access_token = auth_service.create_access_token(
        user_id=user["id"],
        email=user["email"],
        role=UserRole(user.get("role", "family")),
    )
    refresh_token = auth_service.create_refresh_token(user_id=user["id"])

    logger.info("user_logged_in", user_id=user["id"], email=user["email"])

    return ApiResponse(
        success=True,
        message="Login successful",
        data={
            "user": {
                "id": user["id"],
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "role": user["role"],
                "phone": user.get("phone"),
            },
            "token": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": 86400,
            },
        },
    )


@router.post("/refresh", response_model=ApiResponse)
async def refresh_token(refresh_data: TokenRefresh):
    """Refresh access token."""
    auth_service = AuthService()

    new_access_token = auth_service.refresh_access_token(refresh_data.refresh_token)

    if not new_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    return ApiResponse(
        success=True,
        message="Token refreshed successfully",
        data={
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": 86400,
        },
    )


@router.post("/logout", response_model=ApiResponse)
async def logout(user: dict = Depends(get_current_user)):
    """Logout user (invalidate token)."""
    # In a production system, you would add the token to a blacklist
    # or use a token store that supports revocation
    logger.info("user_logged_out", user_id=user["id"])

    return ApiResponse(
        success=True,
        message="Logout successful",
    )


@router.get("/me", response_model=ApiResponse)
async def get_me(user: dict = Depends(get_current_user)):
    """Get current user profile."""
    return ApiResponse(
        success=True,
        data={
            "id": user["id"],
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "role": user["role"],
            "phone": user.get("phone"),
            "is_verified": user.get("is_verified", False),
            "created_at": user.get("created_at"),
        },
    )


@router.post("/password-reset-request", response_model=ApiResponse)
async def request_password_reset(reset_data: PasswordResetRequest):
    """Request password reset."""
    baserow = BaserowService()
    auth_service = AuthService()

    user = await baserow.get_user_by_email(reset_data.email)

    if user:
        # Generate reset token
        reset_token = auth_service.generate_password_reset_token(user["id"])

        # In production, send email with reset link
        # await notification_service.send_password_reset_email(user["email"], reset_token)

        logger.info("password_reset_requested", user_id=user["id"])

    # Always return success to prevent email enumeration
    return ApiResponse(
        success=True,
        message="If an account exists with this email, you will receive password reset instructions",
    )


@router.post("/password-reset", response_model=ApiResponse)
async def reset_password(reset_data: PasswordReset):
    """Reset password using token."""
    auth_service = AuthService()
    baserow = BaserowService()

    user_id = auth_service.verify_password_reset_token(reset_data.token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Hash new password
    hashed_password = auth_service.hash_password(reset_data.new_password)

    # Update user password
    await baserow.update_user(user_id, {
        "password_hash": hashed_password,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })

    logger.info("password_reset_complete", user_id=user_id)

    return ApiResponse(
        success=True,
        message="Password reset successfully",
    )


@router.post("/change-password", response_model=ApiResponse)
async def change_password(
    password_data: ChangePassword,
    user: dict = Depends(get_current_user),
):
    """Change user password."""
    auth_service = AuthService()
    baserow = BaserowService()

    # Verify current password
    if not auth_service.verify_password(password_data.current_password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Hash new password
    hashed_password = auth_service.hash_password(password_data.new_password)

    # Update password
    await baserow.update_user(user["id"], {
        "password_hash": hashed_password,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })

    logger.info("password_changed", user_id=user["id"])

    return ApiResponse(
        success=True,
        message="Password changed successfully",
    )
