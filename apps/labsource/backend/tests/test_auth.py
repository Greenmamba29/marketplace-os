"""
Authentication Tests for LabSource
"""

import pytest
from datetime import datetime, timedelta
from jose import jwt

from src.services.auth import AuthService, pwd_context
from src.config import get_settings


class TestAuthService:
    """Test authentication service."""
    
    @pytest.fixture
    def auth_service(self):
        return AuthService()
    
    def test_password_hashing(self, auth_service):
        """Test password hashing and verification."""
        password = "testpassword123"
        hashed = auth_service.hash_password(password)
        
        assert hashed != password
        assert auth_service.verify_password(password, hashed)
        assert not auth_service.verify_password("wrongpassword", hashed)
    
    def test_create_access_token(self, auth_service):
        """Test access token creation."""
        settings = get_settings()
        token = auth_service.create_access_token(
            user_id="user-123",
            email="test@lab.edu",
            role="buyer"
        )
        
        assert token is not None
        
        # Decode and verify
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        
        assert payload["sub"] == "user-123"
        assert payload["email"] == "test@lab.edu"
        assert payload["role"] == "buyer"
        assert payload["type"] == "access"
    
    def test_create_refresh_token(self, auth_service):
        """Test refresh token creation."""
        settings = get_settings()
        token = auth_service.create_refresh_token("user-123")
        
        assert token is not None
        
        # Decode and verify
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        
        assert payload["sub"] == "user-123"
        assert payload["type"] == "refresh"
    
    def test_decode_token(self, auth_service):
        """Test token decoding."""
        token = auth_service.create_access_token(
            user_id="user-123",
            email="test@lab.edu",
            role="buyer"
        )
        
        payload = auth_service.decode_token(token)
        
        assert payload.sub == "user-123"
        assert payload.email == "test@lab.edu"
        assert payload.role == "buyer"


class TestAuthRouter:
    """Test authentication router endpoints."""
    
    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient
        from src.main import app
        return TestClient(app)
    
    def test_login_endpoint(self, client):
        """Test login endpoint."""
        # This would require a test database with a known user
        # For now, just test the endpoint structure
        response = client.post("/api/v1/auth/login", json={
            "email": "test@lab.edu",
            "password": "testpassword123"
        })
        
        # Should fail with 401 (user doesn't exist in test)
        assert response.status_code in [200, 401]
    
    def test_register_endpoint_validation(self, client):
        """Test register endpoint validation."""
        # Test with invalid data
        response = client.post("/api/v1/auth/register", json={
            "email": "invalid-email",
            "password": "short",
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_me_endpoint_unauthorized(self, client):
        """Test /me endpoint without authentication."""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code == 403  # Forbidden (no token)


class TestCLIAService:
    """Test CLIA service."""
    
    @pytest.fixture
    def clia_service(self):
        from src.services.clia import CLIAService
        return CLIAService()
    
    @pytest.mark.asyncio
    async def test_validate_clia_number_format(self, clia_service):
        """Test CLIA number format validation."""
        # Valid format
        result = await clia_service.validate_clia_number("AB12345670")
        assert result["valid"] is True
        
        # Invalid format - too short
        result = await clia_service.validate_clia_number("AB123")
        assert result["valid"] is False
        
        # Invalid format - wrong pattern
        result = await clia_service.validate_clia_number("INVALID")
        assert result["valid"] is False
        
        # Empty CLIA number
        result = await clia_service.validate_clia_number("")
        assert result["valid"] is False
