"""Tests for RFQ router."""

import pytest
from fastapi.testclient import TestClient

from barrelhub_backend.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


def test_list_rfqs(client):
    """Test listing RFQs."""
    response = client.get("/api/v1/rfq")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


def test_get_rfq(client):
    """Test getting a single RFQ."""
    response = client.get("/api/v1/rfq/rfq-001")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "rfq_number" in data


def test_create_rfq(client):
    """Test creating an RFQ."""
    rfq_data = {
        "spirit_type": "bourbon",
        "age_preference": {"min_age": 4, "max_age": 10},
        "proof_requirements": {"min_proof": 90, "max_proof": 120},
        "volume_required": 5000,
        "delivery_timeline": "3-6 months",
        "ttb_compliance_required": True,
    }
    response = client.post("/api/v1/rfq", json=rfq_data)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["status"] == "draft"


def test_submit_rfq(client):
    """Test submitting an RFQ."""
    # First create a draft RFQ
    rfq_data = {
        "spirit_type": "bourbon",
        "age_preference": {"min_age": 4, "max_age": 10},
        "proof_requirements": {"min_proof": 90, "max_proof": 120},
        "volume_required": 5000,
        "delivery_timeline": "3-6 months",
        "ttb_compliance_required": True,
    }
    create_response = client.post("/api/v1/rfq", json=rfq_data)
    rfq_id = create_response.json()["id"]
    
    # Submit the RFQ
    response = client.post(f"/api/v1/rfq/{rfq_id}/submit")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "submitted"
