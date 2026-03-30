"""Tests for barrels router."""

import pytest
from fastapi.testclient import TestClient

from barrelhub_backend.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


def test_list_barrels(client):
    """Test listing barrels."""
    response = client.get("/api/v1/barrels")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


def test_get_barrel(client):
    """Test getting a single barrel."""
    response = client.get("/api/v1/barrels/barrel-001")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "barrel_number" in data


def test_get_barrel_not_found(client):
    """Test getting a non-existent barrel."""
    response = client.get("/api/v1/barrels/non-existent")
    assert response.status_code == 404


def test_search_barrels(client):
    """Test searching barrels."""
    response = client.get("/api/v1/barrels/search?q=B2024")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_barrel_filters(client):
    """Test getting filter options."""
    response = client.get("/api/v1/barrels/filters")
    assert response.status_code == 200
    data = response.json()
    assert "spirit_types" in data
    assert "distilleries" in data
    assert "age_range" in data
