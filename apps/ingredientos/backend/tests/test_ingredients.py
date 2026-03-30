"""
Tests for ingredient endpoints
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_list_ingredients():
    """Test listing ingredients"""
    response = client.get("/api/v1/ingredients")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "items" in data["data"]


def test_list_ingredients_with_filters():
    """Test listing ingredients with category filter"""
    response = client.get("/api/v1/ingredients?category=sweeteners")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_ingredient():
    """Test getting a specific ingredient"""
    response = client.get("/api/v1/ingredients/ing_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_get_ingredient_not_found():
    """Test getting a non-existent ingredient"""
    response = client.get("/api/v1/ingredients/nonexistent")
    assert response.status_code == 404


def test_search_ingredients():
    """Test searching ingredients"""
    response = client.get("/api/v1/ingredients/search?q=stevia")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_categories():
    """Test getting ingredient categories"""
    response = client.get("/api/v1/ingredients/categories")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_ingredient_regulatory():
    """Test getting ingredient regulatory info"""
    response = client.get("/api/v1/ingredients/ing_001/regulatory")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_ingredient_certifications():
    """Test getting ingredient certifications"""
    response = client.get("/api/v1/ingredients/ing_001/certifications")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_ingredient_allergens():
    """Test getting ingredient allergen profile"""
    response = client.get("/api/v1/ingredients/ing_001/allergens")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
