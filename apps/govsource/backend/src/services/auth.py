"""
Authentication Service for GovSource Backend
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from functools import lru_cache
import structlog

from ..config import get_settings
from ..models.auth import TokenData, User

logger = structlog.get_logger()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthError(Exception):
    """Authentication error."""
    pass


class AuthService:
    """Service for authentication operations."""
    
    def __init__(self):
        self.settings = get_settings()
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    def create_access_token(
        self, 
        data: dict, 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a JWT access token."""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=self.settings.access_token_expire_minutes
            )
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode,
            self.settings.secret_key,
            algorithm=self.settings.algorithm
        )
        
        return encoded_jwt
    
    def decode_token(self, token: str) -> Optional[TokenData]:
        """Decode and validate a JWT token."""
        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm]
            )
            
            user_id: str = payload.get("sub")
            email: str = payload.get("email")
            role: str = payload.get("role")
            
            if user_id is None:
                return None
            
            return TokenData(user_id=user_id, email=email, role=role)
        
        except JWTError:
            return None
    
    def get_token_expiry(self, token: str) -> Optional[datetime]:
        """Get token expiration time."""
        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm],
                options={"verify_exp": False}
            )
            exp = payload.get("exp")
            if exp:
                return datetime.utcfromtimestamp(exp)
            return None
        except JWTError:
            return None


@lru_cache()
def get_auth_service() -> AuthService:
    """Get cached auth service instance."""
    return AuthService()
