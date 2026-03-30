"""Materials tests."""

import pytest
from fastapi.testclient import TestClient


class TestMaterials:
    """Test materials endpoints."""
    
    def test_list_materials_without_auth(self, client: TestClient):
        """Test listing materials without authentication."""
        response = client.get("/api/v1/materials")
        assert response.status_code == 401
    
    def test_get_material_without_auth(self, client: TestClient):
        """Test getting a material without authentication."""
        response = client.get("/api/v1/materials/test-id")
        assert response.status_code == 401
    
    def test_list_mines_without_auth(self, client: TestClient):
        """Test listing mines without authentication."""
        response = client.get("/api/v1/materials/mines")
        assert response.status_code == 401
