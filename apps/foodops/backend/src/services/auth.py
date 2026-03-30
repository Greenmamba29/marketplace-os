"""Authentication service."""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import settings
from ..models.auth import TokenPayload, User


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for handling authentication."""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(
        user_id: str,
        email: str,
        role: str,
        permissions: list,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """Create a JWT access token."""
        if expires_delta is None:
            expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        expire = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "email": email,
            "role": role,
            "permissions": permissions,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access",
        }
        
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    @staticmethod
    def create_refresh_token(user_id: str) -> str:
        """Create a JWT refresh token."""
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh",
        }
        
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    @staticmethod
    def decode_token(token: str) -> Optional[TokenPayload]:
        """Decode and validate a JWT token."""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            
            return TokenPayload(
                sub=payload.get("sub"),
                email=payload.get("email"),
                role=payload.get("role"),
                permissions=payload.get("permissions", []),
                exp=payload.get("exp"),
                iat=payload.get("iat"),
            )
        except JWTError:
            return None
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Verify a token and return its payload."""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None


# Global service instance
auth_service = AuthService()
