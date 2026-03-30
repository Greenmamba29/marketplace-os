"""Authentication router."""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..models.auth import (
    User, UserCreate, UserLogin, Token, TokenPayload,
    PasswordReset, PasswordResetConfirm
)
from ..models.common import ApiResponse
from ..services.auth import auth_service


router = APIRouter()
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> User:
    """Get the current authenticated user."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = auth_service.decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # In production, fetch user from database
    # For now, return mock user
    return User(
        id=payload.sub,
        email=payload.email,
        name="Test User",
        role=payload.role,
        organization_id="org-1",
        organization_name="Test Organization",
        organization_type="restaurant",
        permissions=payload.permissions,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get the current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    return current_user


def require_permissions(required_permissions: list):
    """Dependency factory for permission checking."""
    async def check_permissions(current_user: User = Depends(get_current_active_user)):
        for permission in required_permissions:
            if permission not in current_user.permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing required permission: {permission}",
                )
        return current_user
    return check_permissions


@router.post("/register", response_model=ApiResponse[User])
async def register(user_data: UserCreate):
    """Register a new user account."""
    # In production, check if email exists, hash password, save to database
    hashed_password = auth_service.hash_password(user_data.password)
    
    user = User(
        id=f"user-{datetime.utcnow().timestamp()}",
        email=user_data.email,
        name=user_data.name,
        role="buyer",
        organization_id=f"org-{datetime.utcnow().timestamp()}",
        organization_name=user_data.organization_name,
        organization_type=user_data.organization_type,
        permissions=["read:ingredients", "write:rfq", "read:orders"],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    
    return ApiResponse(
        success=True,
        data=user,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/login", response_model=ApiResponse[Token])
async def login(credentials: UserLogin):
    """Authenticate and get access token."""
    # In production, verify credentials against database
    # For demo, accept any email with password "password"
    if credentials.password != "password":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    role = "admin" if credentials.email == "admin@foodops.io" else "buyer"
    permissions = ["read:ingredients", "write:rfq", "read:orders"]
    if role == "admin":
        permissions.extend(["admin:users", "admin:settings"])
    
    user_id = f"user-{hash(credentials.email) % 10000}"
    
    access_token = auth_service.create_access_token(
        user_id=user_id,
        email=credentials.email,
        role=role,
        permissions=permissions,
    )
    refresh_token = auth_service.create_refresh_token(user_id=user_id)
    
    token = Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=60 * 24,  # 24 hours in minutes
    )
    
    return ApiResponse(
        success=True,
        data=token,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/refresh", response_model=ApiResponse[Token])
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Refresh access token using refresh token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required",
        )
    
    payload = auth_service.verify_token(credentials.credentials)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_id = payload.get("sub")
    
    # In production, fetch user details from database
    access_token = auth_service.create_access_token(
        user_id=user_id,
        email="user@example.com",
        role="buyer",
        permissions=["read:ingredients", "write:rfq"],
    )
    refresh_token = auth_service.create_refresh_token(user_id=user_id)
    
    token = Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=60 * 24,
    )
    
    return ApiResponse(
        success=True,
        data=token,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout user (invalidate token)."""
    # In production, add token to blacklist
    return ApiResponse(
        success=True,
        data={"message": "Successfully logged out"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/me", response_model=ApiResponse[User])
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile."""
    return ApiResponse(
        success=True,
        data=current_user,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/password-reset", response_model=ApiResponse[dict])
async def request_password_reset(data: PasswordReset):
    """Request password reset email."""
    # In production, send email with reset token
    return ApiResponse(
        success=True,
        data={"message": "Password reset email sent"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/password-reset/confirm", response_model=ApiResponse[dict])
async def confirm_password_reset(data: PasswordResetConfirm):
    """Confirm password reset with token."""
    # In production, verify token and update password
    return ApiResponse(
        success=True,
        data={"message": "Password successfully reset"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
