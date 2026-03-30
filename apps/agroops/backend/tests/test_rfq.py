"""Tests for RFQ endpoints."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_list_rfqs():
    """Test listing RFQs."""
    response = client.get("/api/v1/rfq")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


def test_get_rfq():
    """Test getting a single RFQ."""
    response = client.get("/api/v1/rfq/rfq_1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "rfq_1"


def test_get_rfq_not_found():
    """Test getting non-existent RFQ."""
    response = client.get("/api/v1/rfq/nonexistent")
    assert response.status_code == 404


def test_create_rfq_unauthorized():
    """Test creating RFQ without auth."""
    response = client.post(
        "/api/v1/rfq",
        json={
            "title": "Test RFQ",
            "crop_type": "Corn",
            "acres": 100,
            "items": [
                {
                    "input_category": "seed",
                    "description": "Test seed",
                    "quantity": 100,
                    "unit": "bag",
                }
            ],
            "delivery_location": "123 Farm Rd",
            "delivery_state": "IA",
            "delivery_date_start": "2024-05-01T00:00:00Z",
            "delivery_date_end": "2024-05-15T00:00:00Z",
            "bid_deadline": "2024-04-01T00:00:00Z",
        },
    )
    # Will fail without auth token
    assert response.status_code == 401 or response.status_code == 403


def test_get_rfq_quotes():
    """Test getting quotes for an RFQ."""
    response = client.get("/api/v1/rfq/rfq_1/quotes")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
