import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_register():
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "name": "Test User",
        "company": "Test Co",
        "role": "buyer",
        "password": "password123"
    })
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_login():
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()["data"]
