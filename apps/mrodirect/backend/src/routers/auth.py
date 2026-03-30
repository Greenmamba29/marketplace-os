"""Authentication router."""

from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from config import get_settings, UserRole
from models.user import User, UserCreate, UserLogin, Token, UserUpdate
from models.common import APIResponse
from services.auth import AuthService
from services.baserow import BaserowService, BaserowError

router = APIRouter()
security = HTTPBearer()


def get_auth_service() -> AuthService:
    """Get auth service instance."""
    return AuthService()


def get_baserow_service() -> BaserowService:
    """Get Baserow service instance."""
    return BaserowService()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
    baserow_service: BaserowService = Depends(get_baserow_service),
) -> User:
    """Get current authenticated user."""
    token = credentials.credentials
    user_id = auth_service.verify_token(token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    
    settings = get_settings()
    if not settings.BASEROW_USERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User service unavailable",
        )
    
    try:
        user_data = await baserow_service.get_row(
            settings.BASEROW_USERS_TABLE_ID,
            user_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return User(**user_data)


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get current admin user."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.post("/register", response_model=APIResponse[User])
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Register a new user."""
    settings = get_settings()
    
    if not settings.BASEROW_USERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User service unavailable",
        )
    
    # Check if user already exists
    existing = await baserow_service.get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Hash password
    hashed_password = auth_service.hash_password(user_data.password)
    
    # Create user data
    user_dict = user_data.model_dump(exclude={"password"})
    user_dict["hashed_password"] = hashed_password
    
    try:
        created = await baserow_service.create_row(
            settings.BASEROW_USERS_TABLE_ID,
            user_dict
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}",
        )
    
    return APIResponse.success_response(User(**created))


@router.post("/login", response_model=APIResponse[Token])
async def login(
    credentials: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Login and get access token."""
    # Find user by email
    user_data = await baserow_service.get_user_by_email(credentials.email)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Verify password
    if not auth_service.verify_password(
        credentials.password,
        user_data.get("hashed_password", "")
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Generate tokens
    user_id = str(user_data.get("id"))
    access_token = auth_service.create_access_token(user_id)
    refresh_token = auth_service.create_refresh_token(user_id)
    
    return APIResponse.success_response(Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    ))


@router.post("/refresh", response_model=APIResponse[Token])
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Refresh access token."""
    refresh_token = credentials.credentials
    user_id = auth_service.verify_token(refresh_token, token_type="refresh")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    # Generate new tokens
    access_token = auth_service.create_access_token(user_id)
    new_refresh_token = auth_service.create_refresh_token(user_id)
    
    return APIResponse.success_response(Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    ))


@router.get("/me", response_model=APIResponse[User])
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return APIResponse.success_response(current_user)


@router.patch("/me", response_model=APIResponse[User])
async def update_me(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Update current user profile."""
    settings = get_settings()
    
    if not settings.BASEROW_USERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User service unavailable",
        )
    
    update_data = updates.model_dump(exclude_unset=True)
    
    try:
        updated = await baserow_service.update_row(
            settings.BASEROW_USERS_TABLE_ID,
            current_user.id,
            update_data
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}",
        )
    
    return APIResponse.success_response(User(**updated))


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout (client should discard tokens)."""
    return APIResponse.success_response({"message": "Logged out successfully"})
