"""
Vendors API Tests
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_list_vendors():
    """Test listing vendors."""
    response = client.get("/api/vendors")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_get_vendor():
    """Test getting a specific vendor."""
    response = client.get("/api/vendors/vendor_1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "vendor_1"


def test_get_vendor_not_found():
    """Test getting a non-existent vendor."""
    response = client.get("/api/vendors/nonexistent")
    assert response.status_code == 404


def test_list_vendors_with_filters():
    """Test listing vendors with filters."""
    response = client.get("/api/vendors?setAsides=SDVOSB&samStatus=ACTIVE")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
