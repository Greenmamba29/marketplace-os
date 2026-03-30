"""
Tests for regulatory endpoints
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_get_gras_status():
    """Test getting GRAS status"""
    response = client.get("/api/v1/regulatory/gras/ing_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_get_gras_status_not_found():
    """Test getting GRAS status for ingredient without GRAS"""
    response = client.get("/api/v1/regulatory/gras/nonexistent")
    assert response.status_code == 404


def test_get_certifications():
    """Test getting certifications for ingredient"""
    response = client.get("/api/v1/regulatory/certifications/ing_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_allergen_profile():
    """Test getting allergen profile"""
    response = client.get("/api/v1/regulatory/allergens/ing_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_functional_claims():
    """Test getting functional claims"""
    response = client.get("/api/v1/regulatory/claims/ing_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_compliance_documents():
    """Test getting compliance documents"""
    response = client.get("/api/v1/regulatory/documents/ing_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_search_gras_database():
    """Test searching GRAS database"""
    response = client.get("/api/v1/regulatory/gras-database/search?query=stevia")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_certification_types():
    """Test getting certification types"""
    response = client.get("/api/v1/regulatory/certification-types")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_allergens_list():
    """Test getting allergens list"""
    response = client.get("/api/v1/regulatory/allergens-list")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
