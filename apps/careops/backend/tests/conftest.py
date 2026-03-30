"""Test configuration and fixtures."""

import pytest
from httpx import AsyncClient, ASGITransport

from careops_backend.main import app


@pytest.fixture
async def client():
    """Create test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
def auth_headers():
    """Create authentication headers for testing."""
    return {
        "Authorization": "Bearer test-token"
    }


@pytest.fixture
def sample_user():
    """Sample user data."""
    return {
        "id": "user-123",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "role": "family",
        "is_active": True,
        "is_verified": True,
    }


@pytest.fixture
def sample_caregiver():
    """Sample caregiver data."""
    return {
        "id": "caregiver-123",
        "user_id": "user-456",
        "first_name": "Jane",
        "last_name": "Caregiver",
        "email": "caregiver@example.com",
        "certifications": ["CNA", "HHA"],
        "languages": ["English", "Spanish"],
        "specializations": ["dementia", "mobility"],
        "years_experience": 5,
        "hourly_rate": 25.0,
        "status": "available",
        "background_check_status": "completed",
        "rating": 4.8,
        "review_count": 42,
    }


@pytest.fixture
def sample_care_plan():
    """Sample care plan data."""
    return {
        "id": "cp-123",
        "family_id": "user-123",
        "patient_name": "John Patient",
        "patient_age": 75,
        "care_type": "personal_care",
        "status": "active",
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip_code": "90210",
        },
        "schedule_requirements": {
            "start_date": "2024-01-15",
            "ongoing": True,
            "preferred_days": ["monday", "wednesday", "friday"],
            "preferred_start_time": "09:00",
            "preferred_end_time": "15:00",
            "flexibility": "moderate",
        },
        "care_needs": {
            "mobility_assistance": True,
            "medication_reminders": True,
            "meal_preparation": True,
            "light_housekeeping": False,
            "bathing_dressing": True,
            "toileting_incontinence": False,
            "transportation": True,
            "specialized_care": ["dementia"],
        },
        "emergency_contact": {
            "name": "Jane Family",
            "relationship": "Daughter",
            "phone": "(555) 123-4567",
        },
        "estimated_hours_per_week": 18,
    }
