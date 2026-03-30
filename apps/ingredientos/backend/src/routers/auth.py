"""
Authentication router
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import get_settings
from ..models.auth import User, UserCreate, UserLogin, Token, TokenData
from ..models.common import ApiResponse

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    settings = get_settings()
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get the current user from the JWT token"""
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id, email=payload.get("email"), role=payload.get("role"))
    except JWTError:
        raise credentials_exception
    
    # In production, fetch user from database
    # For now, return mock user
    user = User(
        id=token_data.user_id,
        email=token_data.email or "user@example.com",
        name="Demo User",
        company_name="Demo Company",
        role=token_data.role or "buyer",
        verified=True,
    )
    
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get the current active user"""
    return current_user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require admin role"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.post("/register", response_model=ApiResponse[User])
async def register(user_data: UserCreate):
    """Register a new user"""
    # In production, check if user exists and save to database
    # For now, return mock user
    
    user = User(
        id="usr_" + user_data.email.replace("@", "_"),
        email=user_data.email,
        name=user_data.name,
        company_name=user_data.company_name,
        role=user_data.role,
        verified=False,
        created_at=datetime.utcnow().isoformat(),
    )
    
    return ApiResponse(success=True, data=user, message="User registered successfully")


@router.post("/login", response_model=ApiResponse[Token])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    settings = get_settings()
    
    # In production, verify credentials against database
    # For demo, accept any credentials
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": "usr_123", "email": form_data.username, "role": "buyer"},
        expires_delta=access_token_expires,
    )
    
    token = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )
    
    return ApiResponse(success=True, data=token, message="Login successful")


@router.get("/me", response_model=ApiResponse[User])
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return ApiResponse(success=True, data=current_user)


@router.post("/logout", response_model=ApiResponse[dict])
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout user (invalidate token on client side)"""
    return ApiResponse(success=True, data={}, message="Logout successful")


@router.post("/refresh", response_model=ApiResponse[Token])
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh access token"""
    settings = get_settings()
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": current_user.id, "email": current_user.email, "role": current_user.role},
        expires_delta=access_token_expires,
    )
    
    token = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )
    
    return ApiResponse(success=True, data=token)
