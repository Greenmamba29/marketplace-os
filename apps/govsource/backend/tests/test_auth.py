"""
Authentication Tests
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_login_success():
    """Test successful login."""
    response = client.post("/api/auth/login", json={
        "email": "test@agency.gov",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "accessToken" in data["data"]


def test_login_invalid_credentials():
    """Test login with invalid credentials."""
    response = client.post("/api/auth/login", json={
        "email": "test@agency.gov",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_register():
    """Test user registration."""
    response = client.post("/api/auth/register", json={
        "email": "newuser@agency.gov",
        "password": "password123",
        "firstName": "New",
        "lastName": "User",
        "role": "BUYER"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "accessToken" in data["data"]


def test_get_me_unauthorized():
    """Test getting current user without auth."""
    response = client.get("/api/auth/me")
    assert response.status_code == 403
