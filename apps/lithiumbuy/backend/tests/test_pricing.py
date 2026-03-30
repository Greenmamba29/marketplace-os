"""Pricing tests."""

import pytest
from fastapi.testclient import TestClient


class TestPricing:
    """Test pricing endpoints."""
    
    def test_get_spot_prices_without_auth(self, client: TestClient):
        """Test getting spot prices without authentication."""
        response = client.get("/api/v1/pricing/spot")
        assert response.status_code == 401
    
    def test_get_price_index_without_auth(self, client: TestClient):
        """Test getting price index without authentication."""
        response = client.get("/api/v1/pricing/index/carbonate")
        assert response.status_code == 401
    
    def test_get_all_indices_without_auth(self, client: TestClient):
        """Test getting all indices without authentication."""
        response = client.get("/api/v1/pricing/indices")
        assert response.status_code == 401
    
    def test_get_price_history_without_auth(self, client: TestClient):
        """Test getting price history without authentication."""
        response = client.get(
            "/api/v1/pricing/history?material_form=carbonate&start_date=2024-01-01&end_date=2024-01-31"
        )
        assert response.status_code == 401
