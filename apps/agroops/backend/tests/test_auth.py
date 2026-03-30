"""Tests for authentication."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_login():
    """Test login endpoint."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_register():
    """Test registration endpoint."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepassword",
            "first_name": "New",
            "last_name": "User",
            "state": "IA",
            "role": "buyer",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["first_name"] == "New"


def test_get_me_unauthorized():
    """Test getting current user without auth."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
