"""
Tests for admin endpoints
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_get_platform_stats():
    """Test getting platform statistics"""
    response = client.get("/api/v1/admin/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "total_users" in data["data"]


def test_get_pending_verifications():
    """Test getting pending verifications"""
    response = client.get("/api/v1/admin/verifications/pending")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_verify_ingredient():
    """Test verifying an ingredient"""
    response = client.post("/api/v1/admin/ingredients/ing_001/verify")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_verify_supplier():
    """Test verifying a supplier"""
    response = client.post("/api/v1/admin/suppliers/sup_001/verify")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_compliance_alerts():
    """Test getting compliance alerts"""
    response = client.get("/api/v1/admin/compliance/alerts")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_get_users():
    """Test getting platform users"""
    response = client.get("/api/v1/admin/users")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data


def test_get_buyer_dashboard_stats():
    """Test getting buyer dashboard stats"""
    response = client.get("/api/v1/admin/dashboard/buyer/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_supplier_dashboard_stats():
    """Test getting supplier dashboard stats"""
    response = client.get("/api/v1/admin/dashboard/supplier/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_get_audit_log():
    """Test getting audit log"""
    response = client.get("/api/v1/admin/audit-log")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
