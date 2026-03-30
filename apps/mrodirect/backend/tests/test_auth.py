"""Authentication tests."""

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register_validation():
    """Test registration validation."""
    # Missing required fields
    response = client.post("/api/auth/register", json={})
    assert response.status_code == 422


def test_login_validation():
    """Test login validation."""
    # Missing required fields
    response = client.post("/api/auth/login", json={})
    assert response.status_code == 422


def test_unauthorized_access():
    """Test unauthorized access to protected endpoints."""
    response = client.get("/api/rfq")
    assert response.status_code == 403
