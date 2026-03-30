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


def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "name" in response.json()


@pytest.mark.skip(reason="Requires database")
def test_register():
    """Test user registration."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
            "company_name": "Test Company",
            "role": "buyer",
        },
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.skip(reason="Requires database")
def test_login():
    """Test user login."""
    response = client.post(
        "/api/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword123",
        },
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
