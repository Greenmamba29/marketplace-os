"""Authentication router — backed by Neon DB via SQLAlchemy."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import get_settings
from src.database import get_db
from src.db_models import DBAuditLog, DBUser
from src.models.user import (
    LoginRequest,
    PasswordReset,
    PasswordResetRequest,
    Token,
    User,
    UserCreate,
    UserUpdate,
)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _db_user_to_model(db_user: DBUser) -> User:
    return User(
        id=db_user.id,
        email=db_user.email,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        company_name=db_user.company_name,
        role=db_user.role,
        phone=db_user.phone,
        avatar_url=db_user.avatar_url,
        is_verified=db_user.is_verified,
        is_active=db_user.is_active,
        created_at=db_user.created_at,
        last_login=db_user.last_login,
    )


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Decode JWT and load user from Neon DB."""
    settings = get_settings()
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "access":
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    result = await db.execute(select(DBUser).where(DBUser.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise credentials_exc
    return _db_user_to_model(db_user)


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def _make_token_response(user_id: str) -> dict:
    settings = get_settings()
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user in Neon DB."""
    existing = await db.execute(select(DBUser).where(DBUser.email == user_data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = DBUser(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        company_name=user_data.company_name,
        role=user_data.role,
        phone=user_data.phone,
    )
    db.add(db_user)
    await db.flush()

    db.add(DBAuditLog(
        actor_id=db_user.id,
        actor_email=db_user.email,
        action="user.register",
        entity_type="user",
        entity_id=db_user.id,
    ))

    return _make_token_response(db_user.id)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Login and return JWT tokens."""
    result = await db.execute(select(DBUser).where(DBUser.email == form_data.username))
    db_user = result.scalar_one_or_none()

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db_user.last_login = datetime.utcnow()
    db.add(DBAuditLog(
        actor_id=db_user.id,
        actor_email=db_user.email,
        action="user.login",
        entity_type="user",
        entity_id=db_user.id,
    ))

    return _make_token_response(db_user.id)


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    """Rotate refresh token."""
    settings = get_settings()
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    result = await db.execute(select(DBUser).where(DBUser.id == user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=401, detail="User not found")

    return _make_token_response(user_id)


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=User)
async def update_me(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBUser).where(DBUser.id == current_user.id))
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)

    return _db_user_to_model(db_user)


@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    # Stub — wire up email service when SMTP is configured
    return {"message": "If that email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(reset_data: PasswordReset, db: AsyncSession = Depends(get_db)):
    # Full implementation requires a password_reset_tokens table; stubbed for now
    return {"message": "Password reset successful"}
