"""
Tests for RFQ endpoints
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_list_rfqs():
    """Test listing RFQs"""
    response = client.get("/api/v1/rfq")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_list_rfqs_with_status_filter():
    """Test listing RFQs with status filter"""
    response = client.get("/api/v1/rfq?status=active")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_rfq():
    """Test getting a specific RFQ"""
    response = client.get("/api/v1/rfq/rfq_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_get_rfq_not_found():
    """Test getting a non-existent RFQ"""
    response = client.get("/api/v1/rfq/nonexistent")
    assert response.status_code == 404


def test_create_rfq():
    """Test creating a new RFQ"""
    rfq_data = {
        "title": "Test RFQ",
        "description": "Test description",
        "quantity_kg": 100,
        "delivery_timeline": "Within 1 month",
        "delivery_location": "New York, NY",
        "application": "beverages",
        "ingredient_category": "sweeteners",
        "required_certifications": ["organic"],
        "required_gras_status": True,
    }
    
    response = client.post("/api/v1/rfq", json=rfq_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True


def test_update_rfq():
    """Test updating an RFQ"""
    update_data = {
        "title": "Updated RFQ Title",
        "quantity_kg": 200,
    }
    
    response = client.put("/api/v1/rfq/rfq_001", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_cancel_rfq():
    """Test cancelling an RFQ"""
    response = client.post("/api/v1/rfq/rfq_001/cancel")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_rfq_quotes():
    """Test getting quotes for an RFQ"""
    response = client.get("/api/v1/rfq/rfq_001/quotes")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_submit_quote():
    """Test submitting a quote"""
    quote_data = {
        "unit_price": 50.00,
        "total_price": 5000.00,
        "currency": "USD",
        "lead_time_days": 14,
        "validity_days": 30,
        "incoterm": "FOB",
        "certifications_included": ["organic"],
        "coa_included": True,
        "sample_available": True,
    }
    
    response = client.post("/api/v1/rfq/rfq_001/quotes", json=quote_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True


def test_select_quote():
    """Test selecting a quote"""
    response = client.post("/api/v1/rfq/rfq_001/quotes/qt_001/select")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_quote():
    """Test getting a specific quote"""
    response = client.get("/api/v1/rfq/quotes/qt_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_withdraw_quote():
    """Test withdrawing a quote"""
    response = client.post("/api/v1/rfq/quotes/qt_001/withdraw")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
