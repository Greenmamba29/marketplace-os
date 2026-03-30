"""Tests for inputs endpoints."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_list_inputs():
    """Test listing inputs."""
    response = client.get("/api/v1/inputs")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


def test_list_inputs_with_filters():
    """Test listing inputs with filters."""
    response = client.get("/api/v1/inputs?category=seed&page=1&per_page=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


def test_get_input():
    """Test getting a single input."""
    response = client.get("/api/v1/inputs/input_1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "input_1"


def test_get_input_not_found():
    """Test getting non-existent input."""
    response = client.get("/api/v1/inputs/nonexistent")
    assert response.status_code == 404


def test_get_featured_inputs():
    """Test getting featured inputs."""
    response = client.get("/api/v1/inputs/featured")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
