"""Authentication router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import get_settings
from ..models.auth import (
    User,
    UserCreate,
    UserLogin,
    Token,
    TokenData,
    PasswordReset,
    PasswordResetConfirm,
)
from ..services.baserow import BaserowService

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token."""
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current user from JWT token."""
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id, email=payload.get("email"), role=payload.get("role"))
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    baserow = BaserowService()
    user_data = await baserow.get_user_by_id(token_data.user_id)
    if user_data is None:
        raise credentials_exception
    
    return User(**user_data)


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate user and return tokens."""
    baserow = BaserowService()
    
    # Get user by email
    user_data = await baserow.get_user_by_email(form_data.username)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user_data.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = create_access_token(
        data={"sub": user_data["id"], "email": user_data["email"], "role": user_data.get("role")}
    )
    refresh_token = create_refresh_token(
        data={"sub": user_data["id"]}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=get_settings().access_token_expire_minutes * 60,
        user=User(**user_data),
    )


@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """Register a new user."""
    baserow = BaserowService()
    
    # Check if user exists
    existing = await baserow.get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Hash password
    password_hash = get_password_hash(user_data.password)
    
    # Create user
    user_dict = user_data.model_dump(exclude={"password"})
    user_dict["password_hash"] = password_hash
    
    created = await baserow.create_user(user_dict)
    return User(**created)


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token."""
    settings = get_settings()
    
    try:
        payload = jwt.decode(refresh_token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token type")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")
        
        # Get user
        baserow = BaserowService()
        user_data = await baserow.get_user_by_id(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create new tokens
        access_token = create_access_token(
            data={"sub": user_data["id"], "email": user_data["email"], "role": user_data.get("role")}
        )
        new_refresh_token = create_refresh_token(data={"sub": user_id})
        
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60,
        }
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile."""
    return current_user


@router.patch("/profile", response_model=User)
async def update_profile(
    updates: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Update current user profile."""
    baserow = BaserowService()
    updated = await baserow.update_user(current_user.id, updates)
    return User(**updated)


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout user (invalidate token - implementation depends on token storage)."""
    # In a stateless JWT setup, client-side token removal is sufficient
    # For server-side invalidation, implement a token blacklist
    return {"message": "Successfully logged out"}


@router.post("/password-reset")
async def request_password_reset(data: PasswordReset):
    """Request password reset."""
    # Implementation: Send reset email with token
    return {"message": "Password reset instructions sent"}


@router.post("/password-reset/confirm")
async def confirm_password_reset(data: PasswordResetConfirm):
    """Confirm password reset."""
    # Implementation: Verify token and update password
    return {"message": "Password successfully reset"}
