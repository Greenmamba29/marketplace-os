"""Contracts tests."""

import pytest
from fastapi.testclient import TestClient


class TestContracts:
    """Test contracts endpoints."""
    
    def test_list_contracts_without_auth(self, client: TestClient):
        """Test listing contracts without authentication."""
        response = client.get("/api/v1/contracts")
        assert response.status_code == 401
    
    def test_get_contract_without_auth(self, client: TestClient):
        """Test getting a contract without authentication."""
        response = client.get("/api/v1/contracts/test-id")
        assert response.status_code == 401
    
    def test_create_contract_without_auth(self, client: TestClient):
        """Test creating a contract without authentication."""
        response = client.post("/api/v1/contracts", json={})
        assert response.status_code == 401
