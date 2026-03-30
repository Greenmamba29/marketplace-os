"""Tests for chemicals API."""

import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


@pytest.mark.skip(reason="Requires database")
def test_list_chemicals():
    """Test listing chemicals."""
    response = client.get("/api/chemicals")
    assert response.status_code == 200
    assert "results" in response.json()


@pytest.mark.skip(reason="Requires database")
def test_search_chemicals():
    """Test searching chemicals."""
    response = client.get("/api/chemicals/search?q=acetone")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.skip(reason="Requires database")
def test_get_chemical():
    """Test getting a single chemical."""
    response = client.get("/api/chemicals/1")
    assert response.status_code in [200, 404]


@pytest.mark.skip(reason="Requires database")
def test_get_chemical_by_cas():
    """Test getting chemical by CAS number."""
    response = client.get("/api/chemicals/cas/67-64-1")
    assert response.status_code in [200, 404]
