"""Authentication service."""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings
from models.auth import TokenPayload, User, UserCreate, UserRole

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for handling authentication."""
    
    def __init__(self) -> None:
        """Initialize auth service."""
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM
        self.access_token_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        self.refresh_token_expire = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(
        self,
        user_id: str,
        email: str,
        role: UserRole,
    ) -> str:
        """Create a new access token."""
        now = datetime.now(timezone.utc)
        expire = now + self.access_token_expire
        
        payload = TokenPayload(
            sub=user_id,
            email=email,
            role=role,
            exp=expire,
            iat=now,
        )
        
        return jwt.encode(
            payload.model_dump(),
            self.secret_key,
            algorithm=self.algorithm,
        )
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create a new refresh token."""
        now = datetime.now(timezone.utc)
        expire = now + self.refresh_token_expire
        
        payload = {
            "sub": user_id,
            "type": "refresh",
            "exp": expire,
            "iat": now,
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def decode_token(self, token: str) -> Optional[TokenPayload]:
        """Decode and validate a token."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return TokenPayload(**payload)
        except JWTError as e:
            logger.warning(f"Token decode failed: {e}")
            return None
    
    def verify_refresh_token(self, token: str) -> Optional[str]:
        """Verify a refresh token and return user ID."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            if payload.get("type") != "refresh":
                return None
            return payload.get("sub")
        except JWTError as e:
            logger.warning(f"Refresh token verification failed: {e}")
            return None
    
    async def authenticate_user(
        self,
        email: str,
        password: str,
        get_user_func,
    ) -> Optional[User]:
        """Authenticate a user with email and password."""
        user_data = await get_user_func(email)
        if not user_data:
            return None
        
        # Check password
        hashed_password = user_data.get("password_hash", "")
        if not self.verify_password(password, hashed_password):
            return None
        
        # Convert to User model
        return User(
            id=str(user_data.get("id")),
            email=user_data.get("email"),
            name=user_data.get("name"),
            company_name=user_data.get("company_name"),
            role=UserRole(user_data.get("role", "buyer")),
            phone=user_data.get("phone"),
            address=user_data.get("address"),
            is_active=user_data.get("is_active", True),
            is_verified=user_data.get("is_verified", False),
            created_at=user_data.get("created_at", datetime.now()),
            updated_at=user_data.get("updated_at", datetime.now()),
        )
    
    async def register_user(
        self,
        user_data: UserCreate,
        create_user_func,
    ) -> User:
        """Register a new user."""
        # Hash password
        password_hash = self.hash_password(user_data.password)
        
        # Create user dict (exclude password)
        user_dict = user_data.model_dump(exclude={"password"})
        user_dict["password_hash"] = password_hash
        user_dict["is_active"] = True
        user_dict["is_verified"] = False
        
        # Create user in database
        created = await create_user_func(user_dict)
        
        return User(
            id=str(created.get("id")),
            email=created.get("email"),
            name=created.get("name"),
            company_name=created.get("company_name"),
            role=UserRole(created.get("role", "buyer")),
            phone=created.get("phone"),
            address=created.get("address"),
            is_active=True,
            is_verified=False,
            created_at=created.get("created_at", datetime.now()),
            updated_at=created.get("updated_at", datetime.now()),
        )


# Singleton instance
_auth_service: Optional[AuthService] = None


def get_auth_service() -> AuthService:
    """Get or create auth service instance."""
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service
