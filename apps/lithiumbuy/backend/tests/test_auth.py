"""Authentication tests."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


class TestAuth:
    """Test authentication endpoints."""
    
    def test_health_check(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
    
    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "invalid@example.com", "password": "wrongpassword"},
        )
        assert response.status_code == 401
    
    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "invalid-email",
                "password": "password123",
                "company_name": "Test Company",
                "role": "buyer",
            },
        )
        assert response.status_code == 422
    
    def test_register_short_password(self, client: TestClient):
        """Test registration with short password."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "short",
                "company_name": "Test Company",
                "role": "buyer",
            },
        )
        assert response.status_code == 422
    
    def test_get_me_without_auth(self, client: TestClient):
        """Test getting current user without authentication."""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401
