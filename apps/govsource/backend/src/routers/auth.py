"""
Authentication Router for GovSource Backend
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import structlog

from ..models.auth import UserCreate, UserLogin, Token, User
from ..models.common import ApiResponse, ApiError
from ..services.auth import get_auth_service, AuthService
from ..services.baserow import get_baserow_service, BaserowService
from ..config import get_settings

logger = structlog.get_logger()
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
    baserow: BaserowService = Depends(get_baserow_service),
) -> User:
    """Get the current authenticated user."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_data = auth_service.decode_token(credentials.credentials)
    
    if token_data is None or token_data.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from Baserow
    # This is a mock - in production, fetch from your users table
    user = User(
        id=token_data.user_id,
        email=token_data.email or "",
        firstName="Test",
        lastName="User",
        role=token_data.role or "BUYER",
        createdAt="2024-01-01T00:00:00Z",
        updatedAt="2024-01-01T00:00:00Z",
    )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get the current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    return current_user


@router.post("/register", response_model=ApiResponse[Token])
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service),
    baserow: BaserowService = Depends(get_baserow_service),
):
    """Register a new user."""
    try:
        logger.info("Registering new user", email=user_data.email, role=user_data.role)
        
        # Check if user exists (mock - in production, query Baserow)
        # existing = await baserow.search_rows(BaserowTables.USERS, user_data.email)
        
        # Hash password
        hashed_password = auth_service.hash_password(user_data.password)
        
        # Create user in Baserow (mock)
        user_id = f"user_{hash(user_data.email) % 10000}"
        
        # Create access token
        access_token = auth_service.create_access_token(
            data={
                "sub": user_id,
                "email": user_data.email,
                "role": user_data.role,
            }
        )
        
        # Calculate expires_in
        settings = get_settings()
        expires_in = settings.access_token_expire_minutes * 60
        
        user = User(
            id=user_id,
            email=user_data.email,
            firstName=user_data.first_name,
            lastName=user_data.last_name,
            role=user_data.role,
            createdAt="2024-01-01T00:00:00Z",
            updatedAt="2024-01-01T00:00:00Z",
        )
        
        return ApiResponse(
            data=Token(
                accessToken=access_token,
                tokenType="bearer",
                expiresIn=expires_in,
                user=user,
            )
        )
    
    except Exception as e:
        logger.error("Registration failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=ApiResponse[Token])
async def login(
    credentials: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Authenticate a user and return a token."""
    try:
        logger.info("Login attempt", email=credentials.email)
        
        # Verify user credentials (mock - in production, query Baserow)
        # For demo, accept any email with password "password"
        if credentials.password != "password":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        user_id = f"user_{hash(credentials.email) % 10000}"
        
        # Create access token
        access_token = auth_service.create_access_token(
            data={
                "sub": user_id,
                "email": credentials.email,
                "role": "BUYER",  # Mock role
            }
        )
        
        settings = get_settings()
        expires_in = settings.access_token_expire_minutes * 60
        
        user = User(
            id=user_id,
            email=credentials.email,
            firstName="Test",
            lastName="User",
            role="BUYER",
            createdAt="2024-01-01T00:00:00Z",
            updatedAt="2024-01-01T00:00:00Z",
        )
        
        return ApiResponse(
            data=Token(
                accessToken=access_token,
                tokenType="bearer",
                expiresIn=expires_in,
                user=user,
            )
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.get("/me", response_model=ApiResponse[User])
async def get_me(
    current_user: User = Depends(get_current_active_user),
):
    """Get current user information."""
    return ApiResponse(data=current_user)


@router.post("/refresh", response_model=ApiResponse[Token])
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Refresh an access token."""
    token_data = auth_service.decode_token(credentials.credentials)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Create new token
    access_token = auth_service.create_access_token(
        data={
            "sub": token_data.user_id,
            "email": token_data.email,
            "role": token_data.role,
        }
    )
    
    settings = get_settings()
    expires_in = settings.access_token_expire_minutes * 60
    
    user = User(
        id=token_data.user_id or "",
        email=token_data.email or "",
        firstName="Test",
        lastName="User",
        role=token_data.role or "BUYER",
        createdAt="2024-01-01T00:00:00Z",
        updatedAt="2024-01-01T00:00:00Z",
    )
    
    return ApiResponse(
        data=Token(
            accessToken=access_token,
            tokenType="bearer",
            expiresIn=expires_in,
            user=user,
        )
    )
