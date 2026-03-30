"""Authentication tests."""

import pytest
from datetime import datetime, timezone, timedelta

from careops_backend.services.auth import AuthService
from careops_backend.models.auth import UserRole


class TestAuthService:
    """Test authentication service."""

    def setup_method(self):
        """Set up test fixtures."""
        self.auth_service = AuthService()

    def test_hash_password(self):
        """Test password hashing."""
        password = "testpassword123"
        hashed = self.auth_service.hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 0

    def test_verify_password(self):
        """Test password verification."""
        password = "testpassword123"
        hashed = self.auth_service.hash_password(password)
        
        assert self.auth_service.verify_password(password, hashed) is True
        assert self.auth_service.verify_password("wrongpassword", hashed) is False

    def test_create_access_token(self):
        """Test access token creation."""
        token = self.auth_service.create_access_token(
            user_id="user-123",
            email="test@example.com",
            role=UserRole.FAMILY,
        )
        
        assert token is not None
        assert len(token) > 0

    def test_decode_token(self):
        """Test token decoding."""
        token = self.auth_service.create_access_token(
            user_id="user-123",
            email="test@example.com",
            role=UserRole.FAMILY,
        )
        
        decoded = self.auth_service.decode_token(token)
        
        assert decoded is not None
        assert decoded.user_id == "user-123"
        assert decoded.email == "test@example.com"
        assert decoded.role == UserRole.FAMILY

    def test_verify_token(self):
        """Test token verification."""
        token = self.auth_service.create_access_token(
            user_id="user-123",
            email="test@example.com",
            role=UserRole.FAMILY,
        )
        
        verified = self.auth_service.verify_token(token)
        
        assert verified is not None
        assert verified.user_id == "user-123"

    def test_invalid_token(self):
        """Test invalid token handling."""
        invalid_token = "invalid.token.here"
        
        result = self.auth_service.decode_token(invalid_token)
        
        assert result is None

    def test_password_reset_token(self):
        """Test password reset token generation and verification."""
        user_id = "user-123"
        
        token = self.auth_service.generate_password_reset_token(user_id)
        verified_user_id = self.auth_service.verify_password_reset_token(token)
        
        assert verified_user_id == user_id

    def test_email_verification_token(self):
        """Test email verification token."""
        user_id = "user-123"
        email = "test@example.com"
        
        token = self.auth_service.generate_email_verification_token(user_id, email)
        result = self.auth_service.verify_email_verification_token(token)
        
        assert result is not None
        assert result["user_id"] == user_id
        assert result["email"] == email


@pytest.mark.asyncio
class TestAuthRoutes:
    """Test authentication routes."""

    async def test_register_endpoint(self, client):
        """Test user registration endpoint."""
        response = await client.post(
            "/api/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "password123",
                "first_name": "New",
                "last_name": "User",
                "role": "family",
            },
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "token" in data["data"]

    async def test_login_endpoint(self, client):
        """Test user login endpoint."""
        response = await client.post(
            "/api/auth/login",
            json={
                "email": "demo@careops.io",
                "password": "demo",
            },
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "token" in data["data"]

    async def test_invalid_login(self, client):
        """Test invalid login credentials."""
        response = await client.post(
            "/api/auth/login",
            json={
                "email": "invalid@example.com",
                "password": "wrongpassword",
            },
        )
        
        assert response.status_code == 401
