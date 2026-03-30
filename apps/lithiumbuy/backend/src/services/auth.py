"""Authentication service."""

import logging
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from src.config import settings
from src.services.baserow import baserow_service

logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for handling authentication."""
    
    def __init__(self):
        self.secret_key = settings.secret_key
        self.algorithm = settings.algorithm
        self.access_token_expire = settings.access_token_expire_minutes
        self.refresh_token_expire = settings.refresh_token_expire_days
    
    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(
        self,
        user_id: str,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """Create a new access token."""
        if expires_delta is None:
            expires_delta = timedelta(minutes=self.access_token_expire)
        
        expire = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access",
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create a new refresh token."""
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire)
        
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh",
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def decode_token(self, token: str) -> Optional[dict]:
        """Decode and validate a token."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError as e:
            logger.warning(f"Token validation failed: {e}")
            return None
    
    async def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        """Authenticate a user by email and password."""
        try:
            # Get user from Baserow
            user = await baserow_service.get_user_by_email(email)
            
            if not user:
                logger.warning(f"User not found: {email}")
                return None
            
            # Verify password
            stored_hash = user.get("password_hash", "")
            if not stored_hash or not self.verify_password(password, stored_hash):
                logger.warning(f"Invalid password for user: {email}")
                return None
            
            return user
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None
    
    async def register_user(
        self,
        email: str,
        password: str,
        company_name: str,
        role: str,
    ) -> Optional[dict]:
        """Register a new user."""
        try:
            # Check if user already exists
            existing = await baserow_service.get_user_by_email(email)
            if existing:
                logger.warning(f"User already exists: {email}")
                return None
            
            # Hash password
            password_hash = self.hash_password(password)
            
            # Create user in Baserow
            user_data = {
                "email": email,
                "password_hash": password_hash,
                "company_name": company_name,
                "role": role,
                "is_verified": False,
                "is_active": True,
            }
            
            user = await baserow_service.create_user(user_data)
            return user
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Get a user by ID."""
        try:
            user = await baserow_service.get_row(settings.users_table_id, user_id)
            return user
        except Exception as e:
            logger.error(f"Failed to get user: {e}")
            return None


# Singleton instance
auth_service = AuthService()
