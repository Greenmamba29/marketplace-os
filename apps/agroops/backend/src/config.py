"""Application configuration."""

import os
from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    APP_NAME: str = "AgroOps API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "https://agroops.io"]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/agroops"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Baserow
    BASEROW_URL: str = "https://api.baserow.io"
    BASEROW_TOKEN: str = ""
    BASEROW_DATABASE_ID: int = 0
    
    # Medusa.js
    MEDUSA_URL: str = "http://localhost:9000"
    MEDUSA_API_KEY: str = ""
    
    # EPA API
    EPA_API_URL: str = "https://iaspub.epa.gov/apex/pesticides"
    
    # Weather API (NOAA/OpenWeather)
    WEATHER_API_KEY: str = ""
    WEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5"
    
    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@agroops.io"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Table IDs for Baserow
BASEROW_TABLES = {
    "users": 0,
    "suppliers": 0,
    "products": 0,
    "rfq_submissions": 0,
    "quotes": 0,
    "orders": 0,
    "payments": 0,
    "compliance_records": 0,
    "audit_log": 0,
    "crop_registry": 0,
    "epa_registrations": 0,
    "weather_integration": 0,
    "seasonal_forecasts": 0,
}

# Ag Credit Terms
AG_CREDIT_TERMS = {
    "net_30": {"days": 30, "interest_rate": 0.0},
    "net_60": {"days": 60, "interest_rate": 0.015},  # 1.5%
    "net_90": {"days": 90, "interest_rate": 0.025},  # 2.5% - seasonal terms
}

# EPA Registration Status
EPA_STATUS = {
    "registered": "registered",
    "pending": "pending",
    "expired": "expired",
    "restricted": "restricted",
    "cancelled": "cancelled",
}

# Formulation Types
FORMULATION_TYPES = [
    "EC",  # Emulsifiable Concentrate
    "SC",  # Suspension Concentrate
    "WG",  # Water Dispersible Granules
    "granular",
    "liquid",
    "powder",
    "pellet",
    "other",
]

# Input Categories
INPUT_CATEGORIES = [
    "seed",
    "fertilizer",
    "crop_protection",
    "equipment",
    "livestock",
    "other",
]

# US States for validation
US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "DC", "PR",
]
