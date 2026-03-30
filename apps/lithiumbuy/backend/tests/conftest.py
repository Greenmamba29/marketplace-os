"""Test configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app)


@pytest.fixture
def mock_user():
    """Mock user data."""
    return {
        "id": "test-user-id",
        "email": "test@example.com",
        "company_name": "Test Company",
        "role": "buyer",
        "is_verified": True,
        "is_active": True,
    }


@pytest.fixture
def mock_token():
    """Mock JWT token."""
    return "mock-jwt-token"
