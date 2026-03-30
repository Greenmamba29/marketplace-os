"""Authentication service."""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from config import get_settings
from models.user import TokenPayload


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication and authorization."""
    
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
        user_id: str,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a new access token."""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode = {
            "sub": user_id,
            "exp": expire,
            "type": "access",
            "iat": datetime.utcnow(),
        }
        
        return jwt.encode(
            to_encode,
            self.settings.SECRET_KEY,
            algorithm=self.settings.ALGORITHM,
        )
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create a new refresh token."""
        expire = datetime.utcnow() + timedelta(
            days=self.settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        
        to_encode = {
            "sub": user_id,
            "exp": expire,
            "type": "refresh",
            "iat": datetime.utcnow(),
        }
        
        return jwt.encode(
            to_encode,
            self.settings.SECRET_KEY,
            algorithm=self.settings.ALGORITHM,
        )
    
    def decode_token(self, token: str) -> Optional[TokenPayload]:
        """Decode and validate a token."""
        try:
            payload = jwt.decode(
                token,
                self.settings.SECRET_KEY,
                algorithms=[self.settings.ALGORITHM],
            )
            return TokenPayload(**payload)
        except JWTError:
            return None
    
    def verify_token(self, token: str, token_type: str = "access") -> Optional[str]:
        """Verify a token and return the user ID."""
        payload = self.decode_token(token)
        
        if not payload:
            return None
        
        if payload.type != token_type:
            return None
        
        if payload.exp and datetime.utcnow().timestamp() > payload.exp:
            return None
        
        return payload.sub
