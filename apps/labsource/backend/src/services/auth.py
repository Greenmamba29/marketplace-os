"""
Authentication Service for LabSource
"""

import logging
from datetime import datetime, timedelta
from typing import Optional
from functools import lru_cache

from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import get_settings
from .baserow import BaserowService, get_baserow_service
from ..models.auth import TokenPayload, User, UserCreate, UserLogin

logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthError(Exception):
    """Authentication error."""
    pass


class AuthService:
    """Service for handling authentication."""
    
    def __init__(self, baserow: Optional[BaserowService] = None):
        self.settings = get_settings()
        self.baserow = baserow or get_baserow_service()
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    def create_access_token(self, user_id: str, email: str, role: str) -> str:
        """Create a JWT access token."""
        expires_delta = timedelta(minutes=self.settings.access_token_expire_minutes)
        expire = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "email": email,
            "role": role,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access",
        }
        
        return jwt.encode(
            payload,
            self.settings.secret_key,
            algorithm=self.settings.algorithm,
        )
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create a JWT refresh token."""
        expires_delta = timedelta(days=self.settings.refresh_token_expire_days)
        expire = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh",
        }
        
        return jwt.encode(
            payload,
            self.settings.secret_key,
            algorithm=self.settings.algorithm,
        )
    
    def decode_token(self, token: str) -> TokenPayload:
        """Decode and validate a JWT token."""
        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm],
            )
            
            return TokenPayload(
                sub=payload["sub"],
                email=payload["email"],
                role=payload["role"],
                exp=datetime.fromtimestamp(payload["exp"]),
                iat=datetime.fromtimestamp(payload["iat"]),
            )
        except JWTError as e:
            logger.error(f"Token decode error: {e}")
            raise AuthError("Invalid token")
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password."""
        # Get user from Baserow
        user_data = await self.baserow.get_user_by_email(email)
        
        if not user_data:
            return None
        
        # Verify password
        if not self.verify_password(password, user_data.get("password_hash", "")):
            return None
        
        # Return user model
        return User(
            id=user_data["id"],
            email=user_data["email"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            role=user_data.get("role", "buyer"),
            is_active=user_data.get("is_active", True),
            is_verified=user_data.get("is_verified", False),
            created_at=datetime.fromisoformat(user_data["created_at"]),
            updated_at=datetime.fromisoformat(user_data["updated_at"]),
        )
    
    async def register_user(self, user_data: UserCreate) -> User:
        """Register a new user."""
        # Check if user already exists
        existing = await self.baserow.get_user_by_email(user_data.email)
        if existing:
            raise AuthError("User with this email already exists")
        
        # Hash password
        password_hash = self.hash_password(user_data.password)
        
        # Create user in Baserow
        baserow_data = {
            "email": user_data.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "password_hash": password_hash,
            "role": user_data.role.value,
            "is_active": True,
            "is_verified": False,
            "organization_name": user_data.organization_name,
            "organization_type": user_data.organization_type,
        }
        
        result = await self.baserow.create_user(baserow_data)
        
        # Return user model
        return User(
            id=result["id"],
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            role=user_data.role,
            is_active=True,
            is_verified=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get a user by ID."""
        try:
            user_data = await self.baserow.get_row("USERS", user_id)
            
            return User(
                id=user_data["id"],
                email=user_data["email"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                role=user_data.get("role", "buyer"),
                is_active=user_data.get("is_active", True),
                is_verified=user_data.get("is_verified", False),
                created_at=datetime.fromisoformat(user_data["created_at"]),
                updated_at=datetime.fromisoformat(user_data["updated_at"]),
            )
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None
    
    async def refresh_access_token(self, refresh_token: str) -> str:
        """Create a new access token from a refresh token."""
        try:
            payload = jwt.decode(
                refresh_token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm],
            )
            
            if payload.get("type") != "refresh":
                raise AuthError("Invalid token type")
            
            user_id = payload["sub"]
            user = await self.get_user_by_id(user_id)
            
            if not user or not user.is_active:
                raise AuthError("User not found or inactive")
            
            return self.create_access_token(user.id, user.email, user.role)
        
        except JWTError as e:
            logger.error(f"Refresh token error: {e}")
            raise AuthError("Invalid refresh token")


@lru_cache()
def get_auth_service(baserow: Optional[BaserowService] = None) -> AuthService:
    """Get cached auth service instance."""
    return AuthService(baserow=baserow)
