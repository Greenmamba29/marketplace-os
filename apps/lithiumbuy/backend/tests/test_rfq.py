"""RFQ tests."""

import pytest
from fastapi.testclient import TestClient


class TestRFQ:
    """Test RFQ endpoints."""
    
    def test_list_rfqs_without_auth(self, client: TestClient):
        """Test listing RFQs without authentication."""
        response = client.get("/api/v1/rfq")
        assert response.status_code == 401
    
    def test_get_rfq_without_auth(self, client: TestClient):
        """Test getting an RFQ without authentication."""
        response = client.get("/api/v1/rfq/test-id")
        assert response.status_code == 401
    
    def test_create_rfq_without_auth(self, client: TestClient):
        """Test creating an RFQ without authentication."""
        response = client.post("/api/v1/rfq", json={})
        assert response.status_code == 401
