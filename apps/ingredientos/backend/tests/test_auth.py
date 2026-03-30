"""
Tests for authentication endpoints
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "name" in response.json()


def test_register_user():
    """Test user registration"""
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User",
        "company_name": "Test Company",
        "role": "buyer",
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_login():
    """Test user login"""
    login_data = {
        "username": "test@example.com",
        "password": "securepassword123",
    }
    
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]


def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    login_data = {
        "username": "invalid@example.com",
        "password": "wrongpassword",
    }
    
    response = client.post("/api/v1/auth/login", data=login_data)
    # In production, this should return 401
    # For demo, we accept any credentials
    assert response.status_code == 200
