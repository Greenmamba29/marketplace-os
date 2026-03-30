"""Authentication service."""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from uuid import uuid4

import structlog
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import get_settings
from ..models.auth import TokenData, UserRole

logger = structlog.get_logger()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for handling authentication and authorization."""

    def __init__(self):
        self.settings = get_settings()

    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)

    def create_access_token(
        self,
        user_id: str,
        email: str,
        role: UserRole,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """Create a JWT access token."""
        if expires_delta is None:
            expires_delta = timedelta(minutes=self.settings.access_token_expire_minutes)

        expire = datetime.now(timezone.utc) + expires_delta

        to_encode = {
            "sub": user_id,
            "email": email,
            "role": role.value,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "jti": str(uuid4()),
            "type": "access",
        }

        encoded_jwt = jwt.encode(
            to_encode,
            self.settings.secret_key,
            algorithm=self.settings.algorithm,
        )
        return encoded_jwt

    def create_refresh_token(
        self,
        user_id: str,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """Create a JWT refresh token."""
        if expires_delta is None:
            expires_delta = timedelta(days=self.settings.refresh_token_expire_days)

        expire = datetime.now(timezone.utc) + expires_delta

        to_encode = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "jti": str(uuid4()),
            "type": "refresh",
        }

        encoded_jwt = jwt.encode(
            to_encode,
            self.settings.secret_key,
            algorithm=self.settings.algorithm,
        )
        return encoded_jwt

    def decode_token(self, token: str) -> Optional[TokenData]:
        """Decode and validate a JWT token."""
        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm],
            )

            user_id: str = payload.get("sub")
            email: str = payload.get("email")
            role: str = payload.get("role")
            exp = payload.get("exp")

            if user_id is None:
                return None

            return TokenData(
                user_id=user_id,
                email=email,
                role=UserRole(role) if role else None,
                exp=datetime.fromtimestamp(exp, tz=timezone.utc) if exp else None,
            )

        except JWTError as e:
            logger.warning("token_decode_error", error=str(e))
            return None

    def verify_token(self, token: str, token_type: str = "access") -> Optional[TokenData]:
        """Verify a token and check its type."""
        token_data = self.decode_token(token)

        if token_data is None:
            return None

        # Check token type
        payload = jwt.decode(
            token,
            self.settings.secret_key,
            algorithms=[self.settings.algorithm],
        )

        if payload.get("type") != token_type:
            logger.warning("invalid_token_type", expected=token_type, actual=payload.get("type"))
            return None

        # Check expiration
        if token_data.exp and token_data.exp < datetime.now(timezone.utc):
            logger.warning("token_expired", user_id=token_data.user_id)
            return None

        return token_data

    def refresh_access_token(self, refresh_token: str) -> Optional[str]:
        """Create a new access token from a refresh token."""
        token_data = self.verify_token(refresh_token, token_type="refresh")

        if token_data is None:
            return None

        # Create new access token
        # Note: We need to fetch user details from database in production
        return self.create_access_token(
            user_id=token_data.user_id,
            email=token_data.email or "",
            role=token_data.role or UserRole.FAMILY,
        )

    def generate_password_reset_token(self, user_id: str) -> str:
        """Generate a password reset token."""
        expire = datetime.now(timezone.utc) + timedelta(hours=24)

        to_encode = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "password_reset",
        }

        return jwt.encode(
            to_encode,
            self.settings.secret_key,
            algorithm=self.settings.algorithm,
        )

    def verify_password_reset_token(self, token: str) -> Optional[str]:
        """Verify a password reset token and return user_id."""
        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm],
            )

            if payload.get("type") != "password_reset":
                return None

            return payload.get("sub")

        except JWTError:
            return None

    def generate_email_verification_token(self, user_id: str, email: str) -> str:
        """Generate an email verification token."""
        expire = datetime.now(timezone.utc) + timedelta(days=7)

        to_encode = {
            "sub": user_id,
            "email": email,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "email_verification",
        }

        return jwt.encode(
            to_encode,
            self.settings.secret_key,
            algorithm=self.settings.algorithm,
        )

    def verify_email_verification_token(self, token: str) -> Optional[Dict[str, str]]:
        """Verify an email verification token."""
        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm],
            )

            if payload.get("type") != "email_verification":
                return None

            return {
                "user_id": payload.get("sub"),
                "email": payload.get("email"),
            }

        except JWTError:
            return None
