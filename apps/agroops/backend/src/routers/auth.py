"""Authentication router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from src.config import get_settings
from src.models.auth import (
    LoginRequest,
    PasswordReset,
    PasswordResetRequest,
    Token,
    User,
    UserCreate,
    UserUpdate,
    Supplier,
    SupplierCreate,
    SupplierVerification,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
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
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token."""
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current user from token."""
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "access":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # In production, fetch user from database
    # For now, return mock user
    return User(
        id=user_id,
        email="user@example.com",
        first_name="John",
        last_name="Doe",
        role="buyer",
        state="IA",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return tokens."""
    settings = get_settings()
    
    # In production, verify against database
    # For demo, accept any credentials
    user_id = "user_123"
    
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """Register a new user."""
    # In production, save to database
    # For demo, return mock user
    return User(
        id="user_new",
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        state=user_data.state,
        company_name=user_data.company_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout user."""
    # In production, invalidate token
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current user info."""
    return current_user


@router.post("/refresh", response_model=Token)
async def refresh_token(token: str = Depends(oauth2_scheme)):
    """Refresh access token."""
    settings = get_settings()
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_type: str = payload.get("type")
        
        if token_type != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token type")
        
        user_id: str = payload.get("sub")
        
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = create_refresh_token(data={"sub": user_id})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/password-reset-request")
async def request_password_reset(request: PasswordResetRequest):
    """Request password reset."""
    # In production, send email with reset link
    return {"message": "Password reset email sent"}


@router.post("/password-reset")
async def reset_password(data: PasswordReset):
    """Reset password with token."""
    # In production, verify token and update password
    return {"message": "Password reset successful"}


@router.put("/profile", response_model=User)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update user profile."""
    # In production, update database
    updated = current_user.copy(update=update_data.dict(exclude_unset=True))
    return updated


# Supplier routes
@router.post("/supplier/register", response_model=Supplier)
async def register_supplier(
    supplier_data: SupplierCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Register as a supplier."""
    # In production, save to database
    return Supplier(
        id="supplier_new",
        user_id=current_user.id,
        company_name=supplier_data.company_name,
        contact_name=supplier_data.contact_name,
        contact_email=supplier_data.contact_email,
        contact_phone=supplier_data.contact_phone,
        address=supplier_data.address,
        city=supplier_data.city,
        state=supplier_data.state,
        zip_code=supplier_data.zip_code,
        website=supplier_data.website,
        description=supplier_data.description,
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
